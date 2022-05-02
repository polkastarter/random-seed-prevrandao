import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { RandomSeed } from "../../src/types/RandomSeed";
import type { RandomSeed__factory } from "../../src/types/factories/RandomSeed__factory";

task("deploy:RandomSeed")
  // .addParam("parameterName", "value")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const chainId = await signers[0].getChainId();
    console.log("deploying to network with chainId :", chainId);
    const randomseedFactory: RandomSeed__factory = <RandomSeed__factory>await ethers.getContractFactory("RandomSeed");
    const randomseed: RandomSeed = <RandomSeed>await randomseedFactory.connect(signers[0]).deploy(); // (taskArguments.parameterName);
    await randomseed.deployed();
    console.log("RandomSeed deployed to: ", randomseed.address);
  });
