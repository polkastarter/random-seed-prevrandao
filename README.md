# RandomSeed

## Overview

RandomSeed is a contract to request a 256 Bit random number from a Chainlink VRF oracle and assign it to a contract address with a chain id.

## Setup

Only accounts with `RANDOM_REQUESTER_ROLE` can request a random number.

During deployment, the contract get a subscriptionId assigned, which can be requested by calling the function `s_subscriptionId()`.

Chainlink provides an management UI for the subscriptions :

https://vrf.chain.link

Before a request for random number can be made, the subscription needs to be funded:

- send LINK to contract
- call `topUpSubscription(amount)`

One random number request will cost ~0.3 LINK

## Functions

### requestRandomWords(uint32 \_chainId, address \_contractAddress)

Request a random number from a Chainlink VRF oracle.

`_chainId` of the blockchain where the corresponding contract is deployed

`_contractAddress` contract which we want the random number assign to

Actually, both numbers could be anything, they are just combined to allow the mapping from a contract to one random number.

### getRandomNumber(uint32 \_chainId, address \_contractAddress) returns uint256

using the same parameter a for `requestRandomWords`, about 1-2 minutes later, the 256 Bit random number can be read

### getScheduleRequest(uint32 \_chainId, address \_contractAddress) returns RandomRequest

Same as `getRandomNumber` but returns a struct with all request details.

```solidity
struct RandomRequest {
  uint32 chainId; //  4 Bytes
  uint48 requestTime; //  6 Bytes
  uint48 scheduledTime; //  6 Bytes
  uint48 fullFilledTime; //  6 Bytes
  uint80 spare; // 10 Bytes
  uint256 requestId; // 32 Bytes
  uint256 randomNumber; // 32 Bytes
}

```

## Project Setup

- [Hardhat](https://github.com/nomiclabs/hardhat): compile and run the smart contracts on a local development network
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript types for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Waffle](https://github.com/EthWorks/Waffle): tooling for writing comprehensive smart contract tests
- [Solhint](https://github.com/protofire/solhint): linter
- [Solcover](https://github.com/sc-forks/solidity-coverage): code coverage
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter

## Usage

### Pre Requisites

Before running any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an environment
variable. Follow the example in `.env.example`. If you don't already have a mnemonic, use this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy --greeting "Bonjour, le monde!"
```

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the
[vscode-solidity](https://github.com/juanfranblanco/vscode-solidity) extension. The recommended approach to set the
compiler version is to add the following fields to your VSCode user settings:

```json
{
  "solidity.compileUsingRemoteVersion": "v0.8.4+commit.c7e474f2",
  "solidity.defaultCompiler": "remote"
}
```

Where of course `v0.8.4+commit.c7e474f2` can be replaced with any other version.
