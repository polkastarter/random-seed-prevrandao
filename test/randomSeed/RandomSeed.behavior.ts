import { expect } from "chai";

export function shouldBehaveLikeRandomSeed(): void {

  it("not-owner should not be able to update blocksWait", async function () {
    await expect(this.randomSeed.connect(this.signers.user1).setBlocksWait(1)).to.be.reverted;
  });

  it("owner should be able to update blocksWait", async function () {
    const blocksWait = await this.randomSeed.blocksWait()
    await this.randomSeed.connect(this.signers.admin).setBlocksWait(1);
    expect(await this.randomSeed.blocksWait()).to.equal(1);
    await this.randomSeed.connect(this.signers.admin).setBlocksWait(blocksWait);
    expect(await this.randomSeed.blocksWait()).to.equal(blocksWait);
  });

  it("not-owner should not be able to update blockTime", async function () {
    await expect(this.randomSeed.connect(this.signers.user1).setBlockTime(1)).to.be.reverted;
  });

  it("owner should be able to update blockTime", async function () {
    const blockTime = await this.randomSeed.blockTime()
    await this.randomSeed.connect(this.signers.admin).setBlockTime(1);
    expect(await this.randomSeed.blockTime()).to.equal(1);
    await this.randomSeed.connect(this.signers.admin).setBlockTime(blockTime);
    expect(await this.randomSeed.blockTime()).to.equal(blockTime);
  });

}
