import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { shouldBehaveLikeRandomSeed } from "./RandomSeed.behavior";
import { deployRandomSeedFixture } from "./RandomSeed.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user1 = signers[1];
    this.signers.requester = signers[2];

    this.loadFixture = loadFixture;
  });

  describe("RandomSeed", function () {
    before(async function () {
      const { randomSeed } = await this.loadFixture(deployRandomSeedFixture);
      this.randomSeed = randomSeed;
    });

    shouldBehaveLikeRandomSeed("Project-" + new Date().getTime()); // first run
    shouldBehaveLikeRandomSeed("Project-" + new Date().getTime()); // one more time
  });

});
