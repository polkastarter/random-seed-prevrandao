import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { RandomSeed } from "../../src/types/RandomSeed";
import { RandomSeed__factory } from "../../src/types/factories/RandomSeed__factory";

task("deploy:RandomSeed")
  // .addParam("parameterName", "value")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const randomseedFactory: RandomSeed__factory = <RandomSeed__factory>await ethers.getContractFactory("RandomSeed");
    const randomseed: RandomSeed = <RandomSeed>await randomseedFactory.deploy(); // (taskArguments.parameterName);
    await randomseed.deployed();
    console.log("RandomSeed deployed to: ", randomseed.address);
  });
