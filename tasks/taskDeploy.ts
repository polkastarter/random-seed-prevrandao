import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

// import type { RandomSeed } from "../types/contracts/RandomSeed";
// import type { RandomSeed__factory } from "../types/factories/contracts/RandomSeed__factory";

task("task:deployRandomSeed")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers = await ethers.getSigners();
    const randomSeedFactory = await ethers.getContractFactory("RandomSeed");
    const randomSeed = await randomSeedFactory.connect(signers[0]).deploy();
    await randomSeed.waitForDeployment();
    console.log("RandomSeed deployed to: ", await randomSeed.getAddress());
  });
