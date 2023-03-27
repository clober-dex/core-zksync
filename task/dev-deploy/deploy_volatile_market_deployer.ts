import { task } from 'hardhat/config'
import { Provider, Wallet } from 'zksync-web3'
import { Deployer } from '@matterlabs/hardhat-zksync-deploy'
import { BigNumber } from 'ethers'

import { getPrivateKeyFromKeyfile, liveLog } from '../../utils/misc'

task('dev:deploy-volatile-market-deployer').setAction(async (taskArgs, hre) => {
  liveLog(`Running zksync deploy script`)

  // @ts-ignore
  const provider = new Provider(hre.network.config.url)

  // Initialize the wallet.
  const wallet = new Wallet(
    getPrivateKeyFromKeyfile('./clober-deployer-key.json'),
    provider,
  )

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet)

  const contractDeployer = await hre.ethers.getContractAt(
    'IContractDeployer',
    '0x0000000000000000000000000000000000008006',
  )
  const nonceHolder = await hre.ethers.getContractAt(
    'INonceHolder',
    '0x0000000000000000000000000000000000008003',
  )

  let constructorArguments: any[] = []

  const deploymentNonce = await nonceHolder.getDeploymentNonce(wallet.address)
  const computedFactoryAddress = await contractDeployer.getNewAddressCreate(
    wallet.address,
    BigNumber.from(deploymentNonce.add(2)),
  )
  liveLog(`computedFactoryAddress is ${computedFactoryAddress}`)

  constructorArguments = [computedFactoryAddress]
  const volatileMarketDeployer = await deployer.deploy(
    await deployer.loadArtifact(
      'contracts/markets/VolatileMarketDeployerFlatten.sol:VolatileMarketDeployer',
    ),
    constructorArguments,
    undefined,
    [
      (
        await deployer.loadArtifact(
          'contracts/markets/VolatileMarketDeployerFlatten.sol:VolatileMarket',
        )
      ).bytecode,
    ],
  )
  liveLog(
    `VolatileMarketDeployer was deployed as ${volatileMarketDeployer.address}`,
  )

  await hre.run('verify:verify', {
    address: volatileMarketDeployer.address,
    contract:
      'contracts/markets/VolatileMarketDeployerFlatten.sol:VolatileMarketDeployer',
    constructorArguments: constructorArguments,
  })
})
