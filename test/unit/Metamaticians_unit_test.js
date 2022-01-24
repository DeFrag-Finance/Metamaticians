// ALL OF THE SKIPPED SPECS ARE DUE TO uniswapRouter NOT MOCKED OUT LOCALLY
// COMMENT OUT THE SWAP FUNCTIONALITY AND ALL OF THE SPECS WILL PASS

/* eslint-disable no-unused-expressions */
/* eslint-disable node/no-extraneous-require */
/* eslint-disable no-undef */
const {
  networkConfig,
  autoFundCheck,
  developmentChains,
} = require("../../helper-hardhat-config");
require("mocha-skip-if");
const chai = require("chai");
const { expect } = require("chai");
const BN = require("bn.js");
chai.use(require("chai-bn")(BN));
const { expectRevert } = require("@openzeppelin/test-helpers");

skip
  .if(!developmentChains.includes(network.name))
  .describe("Metamaticians Unit Tests", async function () {
    let metamaticians;
    let networkName;
    let vrfCoordinatorMock;
    let uniswapRouterMock;
    const deadline = new Date(new Date().getTime() + 20 * 60000).getTime();

    beforeEach(async () => {
      const chainId = await getChainId();
      await deployments.fixture(["mocks", "vrf"]);
      const LinkToken = await deployments.get("LinkToken");
      linkToken = await ethers.getContractAt("LinkToken", LinkToken.address);
      networkName = networkConfig[chainId].name;

      linkTokenAddress = linkToken.address;
      additionalMessage = " --linkaddress " + linkTokenAddress;

      const Metamaticians = await deployments.get("Metamaticians");
      metamaticians = await ethers.getContractAt(
        "Metamaticians",
        Metamaticians.address
      );

      const VRFCoordinatorMock = await deployments.get("VRFCoordinatorMock");
      vrfCoordinatorMock = await ethers.getContractAt(
        "VRFCoordinatorMock",
        VRFCoordinatorMock.address
      );

      // Seed the Uniswap Router with a bunch of LINK
      uniswapRouterMock = await deployments.get("UniswapRouterMock");
      for (let i = 0; i < 3; i++) {
        await hre.run("fund-link", {
          contract: uniswapRouterMock.address,
          linkaddress: linkTokenAddress,
        });
      }
    });

    it("Should handle any number of digits from VRF", async () => {
      const [contractOwner, user] = await ethers.getSigners();

      await metamaticians.connect(user).mintItem(1, deadline, {
        value: ethers.utils.parseEther("0.618"),
      });

      let requestId = await metamaticians.minterToRequestId(user.address);
      expect(requestId).to.not.be.null;

      await vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "30207470459964961279215818016791723193587102244018403859363363849439350753829",
        metamaticians.address
      );

      let pieceOfPi = await metamaticians.tokenIdToPieceOfPi(1);
      expect(pieceOfPi).to.equal("74384308");

      await metamaticians.connect(user).mintItem(1, deadline, {
        value: ethers.utils.parseEther("0.618"),
      });

      requestId = await metamaticians.minterToRequestId(user.address);
      expect(requestId).to.not.be.null;

      await vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        metamaticians.address
      );

      pieceOfPi = await metamaticians.tokenIdToPieceOfPi(2);
      expect(pieceOfPi).to.equal("34561084");

      await metamaticians.connect(user).mintItem(1, deadline, {
        value: ethers.utils.parseEther("0.618"),
      });

      requestId = await metamaticians.minterToRequestId(user.address);
      expect(requestId).to.not.be.null;

      await vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "1",
        metamaticians.address
      );

      pieceOfPi = await metamaticians.tokenIdToPieceOfPi(3);
      expect(pieceOfPi).to.equal("76305980");

      await metamaticians.connect(user).mintItem(1, deadline, {
        value: ethers.utils.parseEther("0.618"),
      });

      requestId = await metamaticians.minterToRequestId(user.address);
      expect(requestId).to.not.be.null;

      await vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "01009451339826811151214206840840049084666821246990",
        metamaticians.address
      );

      pieceOfPi = await metamaticians.tokenIdToPieceOfPi(4);
      expect(pieceOfPi).to.equal("81292916");
    });

    it("Should successfully mint a public NFT with random attributes", async () => {
      const [contractOwner, user, secondUser] = await ethers.getSigners();

      await metamaticians.connect(user).mintItem(1, deadline, {
        value: ethers.utils.parseEther("0.618"),
      });

      let requestId = await metamaticians.minterToRequestId(user.address);
      expect(requestId).to.not.be.null;

      expect(await metamaticians.ownerOf(1)).to.equal(user.address);

      await vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "30207470459964961279215818016791723193587102244018403859363363849439350753829",
        metamaticians.address
      );

      let response = await metamaticians.tokenURI(1);
      let json = Buffer.from(response.substring(29), "base64").toString();

      expect(json).to.include("Khayyam");
      expect(json).to.include("The Coordinator");
      expect(json).to.include("Vega");
      expect(json).to.include("74384308");

      expect(await metamaticians.tokenIdToPieceOfPi(1)).to.equal("74384308");

      await metamaticians.connect(secondUser).mintItem(1, deadline, {
        value: ethers.utils.parseEther("0.618"),
      });

      requestId = await metamaticians.minterToRequestId(secondUser.address);
      expect(requestId).to.not.be.null;

      expect(await metamaticians.ownerOf(2)).to.equal(secondUser.address);

      await vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "77734733629987857856152572232120272309070413349491540099316769520811665411907",
        metamaticians.address
      );

      response = await metamaticians.tokenURI(2);
      json = Buffer.from(response.substring(29), "base64").toString();

      expect(json).to.include("Democritus");
      expect(json).to.include("The Uniform");
      expect(json).to.include("Rho");
      expect(json).to.include("45638950");

      expect(await metamaticians.tokenIdToPieceOfPi(2)).to.equal("45638950");

      await metamaticians.connect(user).mintItem(1, deadline, {
        value: ethers.utils.parseEther("0.618"),
      });

      requestId = await metamaticians.minterToRequestId(user.address);
      expect(requestId).to.not.be.null;

      expect(await metamaticians.ownerOf(3)).to.equal(user.address);

      await vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "82764548789447642629320452909154086827707257530015862995128620495950836054284",
        metamaticians.address
      );

      response = await metamaticians.tokenURI(3);
      json = Buffer.from(response.substring(29), "base64").toString();

      expect(json).to.include("Alexandrov");
      expect(json).to.include("The Counter");
      expect(json).to.include("Theta");
      expect(json).to.include("87645249");

      expect(await metamaticians.tokenIdToPieceOfPi(3)).to.equal("87645249");
    });

    it("Should successfully mint NFT for owners only", async () => {
      // fund the metamaticians contract to simulate the leftover LINK for Treasury mints
      await hre.run("fund-link", {
        contract: metamaticians.address,
        linkaddress: linkTokenAddress,
      });

      const [contractOwner, user] = await ethers.getSigners();

      await expectRevert(
        metamaticians.connect(user).ownerMintItem(1),
        "Ownable: caller is not the owner"
      );

      await metamaticians.connect(contractOwner).ownerMintItem(1);
      expect(await metamaticians.ownerOf(1)).to.equal(contractOwner.address);
    });

    it("Limits mints to 50 per address", async () => {
      // add more LINK to the pool to have enough for 50 mints
      for (let i = 0; i < 30; i++) {
        await hre.run("fund-link", {
          contract: uniswapRouterMock.address,
          linkaddress: linkTokenAddress,
        });
      }
      const [contractOwner, user] = await ethers.getSigners();

      await metamaticians.connect(user).mintItem(25, deadline, {
        value: ethers.utils.parseEther("15.45"),
      });

      const requestId = await metamaticians.minterToRequestId(user.address);
      expect(requestId).to.not.be.null;

      expect(await metamaticians.ownerOf(25)).to.equal(user.address);

      await expectRevert(
        metamaticians.connect(user).mintItem(26, deadline, {
          value: ethers.utils.parseEther("16.068"),
        }),
        "Mint limit reached per account"
      );

      await metamaticians.connect(user).mintItem(25, deadline, {
        value: ethers.utils.parseEther("15.45"),
      });

      expect(await metamaticians.ownerOf(50)).to.equal(user.address);

      await expectRevert(
        metamaticians.connect(user).mintItem(1, deadline, {
          value: ethers.utils.parseEther("0.618"),
        }),
        "Mint limit reached per account"
      );
    });

    it("Let's only the owner to update the royalty fee", async () => {
      const [contractOwner, user] = await ethers.getSigners();

      await expectRevert(
        metamaticians.connect(user).setNewRoyaltyFeeBasisPoints(1000),
        "Ownable: caller is not the owner"
      );

      await metamaticians
        .connect(contractOwner)
        .setNewRoyaltyFeeBasisPoints(1000);

      const newRoyalty = await metamaticians.royaltyFee();
      expect(newRoyalty).to.equal(1000);
    });

    it("Let's only the owner to update the owner of the contract", async () => {
      const [contractOwner, user] = await ethers.getSigners();

      await expectRevert(
        metamaticians.connect(user).transferOwnership(user.address),
        "Ownable: caller is not the owner"
      );

      await metamaticians
        .connect(contractOwner)
        .transferOwnership(user.address);

      const newOwner = await metamaticians.owner();
      expect(newOwner).to.equal(user.address);
    });

    it("Returns contractURI json", async () => {
      const [contractOwner] = await ethers.getSigners();

      const response = await metamaticians.contractURI();
      const json = Buffer.from(response.substring(29), "base64").toString();

      expect(json).to.include("Metamaticians");
      expect(json).to.include(
        "Metamaticians are randomly generated and have 100% on-chain art and metadata"
      );
      expect(json).to.include(500);
      expect(json).to.include("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    });
  });
