import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { shouldBehaveLikeRandomSeed } from "./RandomSeed.behavior";
import { deployRandomSeedFixture } from "./RandomSeed.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user1 = signers[1];

    this.loadFixture = loadFixture;
  });

  describe("RandomSeed", function () {
    beforeEach(async function () {
      const { randomSeed } = await this.loadFixture(deployRandomSeedFixture);
      this.randomSeed = randomSeed;
    });

    shouldBehaveLikeRandomSeed();
  });
});
