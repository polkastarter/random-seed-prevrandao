import { expect } from "chai";
import { ethers } from "hardhat";

import {
  getBlockNumber, mineBlock, mineBlocks, mineBlocksUpTo,
  timePeriod, getTimestamp, moveTime, waitTime, setTime, consoleLog_timestamp
} from "../blockTimeHelpers";

export function shouldBehaveLikeRandomSeed(projectName: string): void {

  const blocksWait = 128;
  const blockTime = 15;

  let scheduledBlockNumber: bigint;

  console.log("projectName =", projectName);

  it("should have a project name", async function () {
    expect(projectName.length > 0);
  });

  it("not-owner should NOT be able to update blocksWait", async function () {
    await expect(this.randomSeed.connect(this.signers.user1).setBlocksWait(1)).to.be.reverted;
  });

  it("owner should be able to update blocksWait", async function () {
    await this.randomSeed.connect(this.signers.admin).setBlocksWait(1);
    expect(await this.randomSeed.blocksWait()).to.equal(1);
    await this.randomSeed.connect(this.signers.admin).setBlocksWait(blocksWait);
    expect(await this.randomSeed.blocksWait()).to.equal(blocksWait);
  });

  it("not-owner should NOT be able to update blockTime", async function () {
    await expect(this.randomSeed.connect(this.signers.user1).setBlockTime(1)).to.be.reverted;
  });

  it("owner should be able to update blockTime", async function () {
    await this.randomSeed.connect(this.signers.admin).setBlockTime(1);
    expect(await this.randomSeed.blockTime()).to.equal(1);
    await this.randomSeed.connect(this.signers.admin).setBlockTime(blockTime);
    expect(await this.randomSeed.blockTime()).to.equal(blockTime);
  });

  it("user should NOT be able to request random number", async function () {
    await expect(this.randomSeed.connect(this.signers.user1).requestRandomWords(projectName)).to.be.reverted;
  });

  it("initially requester should NOT be able to request random number", async function () {
    await expect(this.randomSeed.connect(this.signers.user1).requestRandomWords(projectName)).to.be.reverted;
  });

  it("admin grants requester RANDOM_REQUESTER_ROLE", async function () {
    const RANDOM_REQUESTER_ROLE = await this.randomSeed.RANDOM_REQUESTER_ROLE();
    const tx1 = await this.randomSeed.connect(this.signers.admin).grantRole(RANDOM_REQUESTER_ROLE, this.signers.requester.address);
    await tx1.wait();
    expect(await this.randomSeed.hasRole(RANDOM_REQUESTER_ROLE, this.signers.requester.address)).to.be.true;
  });

  it("requester should be able to request random number", async function () {
    await this.randomSeed.connect(this.signers.requester).requestRandomWords(projectName);
    const randomRequest = await this.randomSeed.getScheduleRequest(projectName);
    console.log(randomRequest);

    const expectedBlockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(expectedBlockNumber);
    // console.log({ block });

    // workaround : 'block' is possibly 'null'.ts(18047)
    let block_timestamp: number = 0
    if (block != null) {
      block_timestamp = block.timestamp;
    }

    expect(randomRequest.requestTime).to.eq(block_timestamp);
    expect(randomRequest.requestId).to.eq(expectedBlockNumber);
    expect(randomRequest.scheduledBlockNumber).to.eq(expectedBlockNumber + blocksWait);
    expect(randomRequest.scheduledTime).to.eq(block_timestamp + (blocksWait * blockTime));

    const scheduledTime: number = Number(await this.randomSeed.getScheduledTime(projectName));
    expect(randomRequest.scheduledTime).to.eq(scheduledTime);

    scheduledBlockNumber = randomRequest.scheduledBlockNumber;
  });

  it("requester can NOT retrieve random number before scheduled block is reached ", async function () {
    const blockNumber = await getBlockNumber();
    await mineBlock();
    expect(await getBlockNumber()).to.eq(blockNumber + 1);
    await expect(this.randomSeed.connect(this.signers.requester).requestRandomWords(projectName)).to.be.revertedWith('wait period not over');
  });

  it("requester can NOT retrieve random number before scheduled block is reached", async function () {
    await mineBlocks(blocksWait - 4);
    expect(await getBlockNumber()).to.eq(scheduledBlockNumber - 2n);
    await expect(this.randomSeed.connect(this.signers.requester).requestRandomWords(projectName)).to.be.revertedWith('wait period not over');

    const randomNumber = await this.randomSeed.getRandomNumber(projectName);
    console.log("randomNumber =", randomNumber);
    expect(randomNumber).to.eq(0, "ERROR: random number is not 0");
  });

  it("requester can retrieve random number once scheduled block is reached", async function () {
    const blockNumber = await getBlockNumber();
    await mineBlock();
    expect(await getBlockNumber()).to.eq(blockNumber + 1);
    await this.randomSeed.connect(this.signers.requester).requestRandomWords(projectName);

    const randomNumber = await this.randomSeed.getRandomNumber(projectName);
    expect(randomNumber).to.not.equal(0, "ERROR: random number is 0");
    console.log("randomNumber =", randomNumber);

    const randomRequest = await this.randomSeed.getScheduleRequest(projectName);
    console.log(randomRequest);

    console.log("randomRequest.scheduledTime - randomRequest.requestTime", randomRequest.scheduledTime - randomRequest.requestTime);
    console.log("randomRequest.fulFilledTime - randomRequest.requestTime", randomRequest.fulFilledTime - randomRequest.requestTime);
  });

  it("requester should NOT be able to request random number again after request already fulfilled", async function () {
    const blockNumber = await getBlockNumber();
    await mineBlock();
    expect(await getBlockNumber()).to.eq(blockNumber + 1);
    await expect(this.randomSeed.connect(this.signers.requester).requestRandomWords(projectName)).to.be.revertedWith("request already fulfilled");
  });

}
