import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { RandomSeed } from "../types/contracts/RandomSeed";
import type { RandomSeed__factory } from "../types/factories/contracts/RandomSeed__factory";

task("task:deployRandomSeed")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const randomSeedFactory: RandomSeed__factory = <RandomSeed__factory>await ethers.getContractFactory("RandomSeed");
    const randomSeed: RandomSeed = <RandomSeed>await randomSeedFactory.connect(signers[0]).deploy();
    await randomSeed.deployed();
    console.log("RandomSeed deployed to: ", randomSeed.address);
  });
