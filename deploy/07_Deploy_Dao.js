const { networkConfig } = require("../helper-hardhat-config");

const getExpectedContractAddress = async (deployer) => {
  const adminAddressTransactionCount = await deployer.getTransactionCount();
  const expectedContractAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: adminAddressTransactionCount + 1,
  });

  return expectedContractAddress;
};

module.exports = async ({ deployments }) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  let linkTokenAddress;
  let vrfCoordinatorAddress;
  let uniswapRouterAddress;

  if (chainId == 31337) {
    linkToken = await get("LinkToken");
    VRFCoordinatorMock = await get("VRFCoordinatorMock");
    linkTokenAddress = linkToken.address;
    vrfCoordinatorAddress = VRFCoordinatorMock.address;
    uniswapRouterMock = await get("UniswapRouterMock");
    uniswapRouterAddress = uniswapRouterMock.address;
  } else {
    linkTokenAddress = networkConfig[chainId].linkToken;
    vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator;
  }
  const keyHash = networkConfig[chainId].keyHash;
  const fee = networkConfig[chainId].fee;

  const metamaticianAttributes = await deploy("MetamaticiansAttributes", {
    from: deployer,
    log: true,
  });

  const metamaticians = await deploy("Metamaticians", {
    from: deployer,
    args: [
      vrfCoordinatorAddress,
      linkTokenAddress,
      keyHash,
      fee,
      metamaticianAttributes.address,
      uniswapRouterAddress || networkConfig[chainId].uniswapRouter,
    ],
    log: true,
  });

  const timelockDelay = 2;

  // const signerAddress = await metamaticians.signer.getAddress();
  const signer = await ethers.getSigner(deployer.address);

  console.log("SIGNER:", deployer);

  const governorExpectedAddress = await getExpectedContractAddress(signer);

  console.log("DEPLOYING TIMELOCK");

  const timelockFactory = await ethers.getContractFactory("Timelock");
  const timelock = await timelockFactory.deploy(
    governorExpectedAddress,
    timelockDelay
  );
  await timelock.deployed();

  console.log("DEPLOYING GOVERNOR");

  const governorFactory = await ethers.getContractFactory("MyGovernor");
  const governor = await governorFactory.deploy(
    metamaticians.address,
    timelock.address
  );
  await governor.deployed();

  console.log("Dao deployed to: ", {
    governorExpectedAddress,
    governor: governor.address,
    timelock: timelock.address,
    tokenAttributes: metamaticianAttributes.address,
    token: metamaticians.address,
  });

  if (chainId != 31337) {
    console.log("VERIFYING TOKEN ATTRIBUTES");

    await run("verify:verify", {
      address: metamaticianAttributes.address,
    });

    console.log("VERIFYING TOKEN");

    await run("verify:verify", {
      address: metamaticians.address,
      constructorArguments: [
        vrfCoordinatorAddress,
        linkTokenAddress,
        keyHash,
        fee,
        metamaticianAttributes.address,
        networkConfig[chainId].uniswapRouter,
      ],
    });

    console.log("VERIFYING TIMELOCK");

    await run("verify:verify", {
      address: timelock.address,
      constructorArguments: [governor.address, timelockDelay],
    });

    console.log("VERIFYING GOVERNOR");

    await run("verify:verify", {
      address: governor.address,
      constructorArguments: [metamaticians.address, timelock.address],
    });
  }
};
module.exports.tags = ["all", "mocks", "main"];
