import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { RandomSeed } from "../../types/contracts/RandomSeed";
import type { RandomSeed__factory } from "../../types/factories/contracts/RandomSeed__factory";

export async function deployRandomSeedFixture(): Promise<{ randomSeed: RandomSeed }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  // const parameter: string = "Hello, world!";
  const randomSeedFactory: RandomSeed__factory = <RandomSeed__factory>await ethers.getContractFactory("RandomSeed");
  const randomSeed: RandomSeed = <RandomSeed>await randomSeedFactory.connect(admin).deploy();
  await randomSeed.deployed();

  return { randomSeed };
}
