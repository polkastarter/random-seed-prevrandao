import { ethers } from "hardhat";

import type { RandomSeed } from "../../types/contracts/RandomSeed";
// import type { RandomSeed__factory } from "../../types/factories/contracts/RandomSeed__factory";

export async function deployRandomSeedFixture(): Promise<{ randomSeed: RandomSeed }> {
  const signers = await ethers.getSigners();
  const admin = signers[0];

  // const parameter: string = "Hello, world!";
  const randomSeedFactory = await ethers.getContractFactory("RandomSeed");
  const randomSeed = await randomSeedFactory.connect(admin).deploy();
  await randomSeed.waitForDeployment();

  return { randomSeed };
}
