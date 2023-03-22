// SPDX-License-Identifier: -
// License: https://license.clober.io/LICENSE.pdf

pragma solidity ^0.8.0;

import "../OrderBook.sol";

contract MockOrderBook is OrderBook {
    uint16 private constant _MAX_INDEX = 36860; // approximately log_1.001(10**16)
    uint128 private constant _PRICE_PRECISION = 10 ** 18;

    constructor(
        address orderToken_,
        address quoteToken_,
        address baseToken_,
        uint96 quoteUnit_,
        int24 makerFee_,
        uint24 takerFee_,
        address factory_
    ) OrderBook(orderToken_, quoteToken_, baseToken_, quoteUnit_, makerFee_, takerFee_, factory_) {}

    function indexToPrice(uint16 priceIndex) public pure override returns (uint128) {
        require(priceIndex <= _MAX_INDEX, "MAX_INDEX");
        return priceIndex * _PRICE_PRECISION;
    }
}
