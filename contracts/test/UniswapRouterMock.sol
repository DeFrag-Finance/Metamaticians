//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

// Based on the real implementation:
// https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol

// This Mock only cares about sending back LINK and ETH to the requester
// to the Metamatician contract to pay for VRF Coordinator

import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "hardhat/console.sol";

contract UniswapRouterMock {
    address public WETH;
    LinkTokenInterface internal immutable LINK;

    constructor(address _LinkToken) {
      LINK = LinkTokenInterface(_LinkToken);
    }

    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        virtual
        payable
        returns (uint[] memory amounts)
    {
        // Current implementation does not utilize an actual pool
        // UniswapRouter simply sends back the requested LINK and returns ETH
        require(LINK.transfer(msg.sender, amountOut), "Not enough LINK");
        TransferHelper.safeTransferETH(msg.sender, msg.value);
    }
}
