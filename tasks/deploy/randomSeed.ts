import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { RandomSeed } from "../../types/contracts/RandomSeed";
import type { RandomSeed__factory } from "../../types/factories/contracts/RandomSeed__factory";

import "@nomiclabs/hardhat-etherscan";
import { hardhatArguments } from "hardhat";

const CONFIRMATION_BLOCKS_WAIT = 10; // actually ~1 minute or 5 blocks should be ok, but let's play it safe

task("deploy:RandomSeed")
  // .addParam("parameterName", "value")
  .setAction(async function (taskArguments: TaskArguments, { ethers, run }) {
    // check if we could verify after deployment
    if (process.env.ETHERSCAN_KEY !== undefined && process.env.ETHERSCAN_KEY.length == 34) {
      const signers: SignerWithAddress[] = await ethers.getSigners();
      const chainId = await signers[0].getChainId();
      console.log("deploying to network with chainId :", chainId);

      // const overrides = {gasPrice: ethers.utils.parseUnits("50", "gwei")};
      const randomSeedFactory: RandomSeed__factory = <RandomSeed__factory>await ethers.getContractFactory("RandomSeed");
      const randomSeed: RandomSeed = <RandomSeed>await randomSeedFactory.connect(signers[0]).deploy(); // (taskArguments.parameterName);
      await randomSeed.deployed();
      console.log("RandomSeed deployed to: ", randomSeed.address);

      let deployBlockNumber = randomSeed.deployTransaction.blockNumber;
      let currentBlockNumber = await ethers.provider.getBlockNumber();

      if (deployBlockNumber === null || deployBlockNumber === undefined) {
        deployBlockNumber = currentBlockNumber; // i.e. rinkeby does not give us a deployTransaction.blockNumber
      }

      console.log("deploy blocknumber   =", deployBlockNumber);
      console.log("current block number =", currentBlockNumber);
      console.log("waiting " + CONFIRMATION_BLOCKS_WAIT + " blocks ...");

      // wait for a few blocks before trying to verify contract on Etherscan
      // const tx2 = await randomSeed.deployTransaction.wait(CONFIRMATION_BLOCKS_WAIT); // would be easy but no count down counter while waiting
      while (currentBlockNumber - deployBlockNumber < CONFIRMATION_BLOCKS_WAIT) {
        console.log(
          currentBlockNumber +
          " - need to wait " +
          (deployBlockNumber + CONFIRMATION_BLOCKS_WAIT - currentBlockNumber) +
          " more blocks ...",
        );
        await new Promise(f => setTimeout(f, 10000));
        currentBlockNumber = await ethers.provider.getBlockNumber();
      }

      await run("verify:verify", {
        address: randomSeed.address,
        constructorArguments: [],
      });
    } else {
      console.log("Can not verify contract on Etherscan - no ETHERSCAN_KEY");
    }
  });
