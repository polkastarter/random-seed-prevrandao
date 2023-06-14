import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

import type { RandomSeed } from "../types/contracts/RandomSeed";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    randomSeed: RandomSeed;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  user1: SignerWithAddress;
  requester: SignerWithAddress;
}
