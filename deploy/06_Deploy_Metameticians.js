const { networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  // const { deploy, get, log } = deployments;
  // const { deployer } = await getNamedAccounts();
  // const chainId = await getChainId();
  // let linkTokenAddress;
  // let vrfCoordinatorAddress;
  // let additionalMessage = "";

  // if (chainId == 31337) {
  //   linkToken = await get("LinkToken");
  //   VRFCoordinatorMock = await get("VRFCoordinatorMock");
  //   linkTokenAddress = linkToken.address;
  //   vrfCoordinatorAddress = VRFCoordinatorMock.address;
  //   additionalMessage = " --linkaddress " + linkTokenAddress;
  // } else {
  //   linkTokenAddress = networkConfig[chainId].linkToken;
  //   vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator;
  // }
  // const keyHash = networkConfig[chainId].keyHash;
  // const fee = networkConfig[chainId].fee;

  // const metamaticianAttributes = await deploy("MetamaticiansAttributes", {
  //   from: deployer,
  //   log: true,
  // });

  // const metamaticians = await deploy("Metamaticians", {
  //   from: deployer,
  //   args: [
  //     vrfCoordinatorAddress,
  //     linkTokenAddress,
  //     keyHash,
  //     fee,
  //     metamaticianAttributes.address,
  //     networkConfig[chainId].uniswapRouter,
  //   ],
  //   log: true,
  // });

  // log("Run the following command to fund contract with LINK:");
  // log(
  //   "npx hardhat fund-link --contract " +
  //     metamaticians.address +
  //     " --network " +
  //     networkConfig[chainId].name +
  //     additionalMessage
  // );
  // log("Then run metamaticians contract with the following command");
  // log(
  //   "npx hardhat request-random-number --contract " +
  //     metamaticians.address +
  //     " --network " +
  //     networkConfig[chainId].name
  // );
  // log("----------------------------------------------------");
};

module.exports.tags = ["all", "vrf"];
