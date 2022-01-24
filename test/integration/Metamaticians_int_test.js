const chai = require("chai");
const { expect } = require("chai");
const skipIf = require("mocha-skip-if");
const BN = require("bn.js");
chai.use(require("chai-bn")(BN));
const { developmentChains } = require("../../helper-hardhat-config");

skip
  .if(developmentChains.includes(network.name))
  .describe("Metamaticians Integration Tests", async function () {
    let metamaticians;

    beforeEach(async () => {
      const Metamaticians = await deployments.get("Metamaticians");
      metamaticians = await ethers.getContractAt(
        "Metamaticians",
        Metamaticians.address
      );
    });

    it("Should successfully make a VRF request and get a result", async () => {
      const transaction = await metamaticians.mintItem({
        value: ethers.utils.parseEther("1"),
      });
      const txReceipt = await transaction.wait();
      const requestId = txReceipt.events[2].topics[1];

      // wait 60 secs for oracle to callback
      await new Promise((resolve) => setTimeout(resolve, 60000));

      const result = await metamaticians.randomResult();
      console.log(
        "VRF Result: ",
        new ethers.BigNumber.from(result._hex).toString()
      );
      expect(
        new ethers.BigNumber.from(result._hex).toString()
      ).to.be.a.bignumber.that.is.greaterThan(
        new ethers.BigNumber.from(0).toString()
      );
    });
  });
