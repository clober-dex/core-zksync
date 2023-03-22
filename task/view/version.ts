import { task } from 'hardhat/config'

task('view:version', 'check all contracts')
  .addParam('address', 'contract address')
  .setAction(async ({ address }, hre) => {
    const contract = await hre.ethers.getContractAt(
      'CloberVersionable',
      address,
    )
    console.log((await contract.VERSION()).toString())
  })
