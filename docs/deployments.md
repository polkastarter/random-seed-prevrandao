# Deployments

## Rinkeby

deployer : 0xa31F3d5d0d8A412084a3f83D253340524F7f8897

### Deploy v0.1

transaction : https://rinkeby.etherscan.io/tx/0xa8aed8e4b5f7821a5a2d1c13dc1ebcec87233217c5fcdd727b7feb04e8576bad

contract address : 0x7a0d2af41d4c78486a5f17d08405955ee4e992c3

https://rinkeby.etherscan.io/address/0x7a0d2af41d4c78486a5f17d08405955ee4e992c3#readContract

s_subscriptionId : 1674

### Test

- send 20 LINK to contract
- call topUpSubscription(20000000000000000000)

Test address
0x0000000000000000000000000000000000000002

### Deploy v0.2

tx : https://rinkeby.etherscan.io/tx/0x6b17c1c26783a05f4171af8c8fdbf8d555a2a997858f1acc3f84a10d0f8de9f0

contract address : 0xd7008D65Bf6C74688075a0aa2e2213A931b523eA

https://rinkeby.etherscan.io/address/0xd7008D65Bf6C74688075a0aa2e2213A931b523eA#readContract

### Test

chainID = 1
address = 0x0000000000000000000000000000000000000002

https://rinkeby.etherscan.io/tx/0xab2dcf9704550e26e616e52433846c6dc3862af8f49553b8c164dbd589f5f184

### Deploy v0.3

tx : https://rinkeby.etherscan.io/tx/0x831eb983ed058efdb4eaa9bd16baddc5bab6d1a9257b0035c0e1aa7170736d3e

contract address : 0x08e192649635d83f7116ed9bb1c72b5b365851da

https://rinkeby.etherscan.io/address/0x08e192649635d83f7116ed9bb1c72b5b365851da#code

### Test

- send 20 LINK to contract
- call topUpSubscription(20000000000000000000)

https://rinkeby.etherscan.io/tx/0x5ceb511dd4e11cadfec62a1bc977eaa69e77217d3ee4c70a910fefe568bb4517

chainID = 1
address = 0x0000000000000000000000000000000000000002

### Deploy 0.4

https://rinkeby.etherscan.io/tx/0x62805dd6b81f15a4be2635eb9ac2bc6df97f81fad2ec18bd8276ef17cf6e55a0

contract address : 0xa7Bf91D60334B8e15CdA4cCC2b188ce7a0a826fe

- send 20 LINK to contract
- call topUpSubscription(20000000000000000000)

forgot to uncomment a few lines ... :-(

### Deploy 0.5

https://rinkeby.etherscan.io/tx/0x019ae84dd5a6755562fe76e432f6def927a54735cb6a86374050b83140090da4

contract address : 0x035AFCA4f12E2192bcF7BD51d492024a98F2fA56

- send 2 LINK to contract
- call topUpSubscription(https://rinkeby.etherscan.io/tx/0x1346431cc24f22f6937453de35d204c7a43158404cefdebe70de114397944610)

https://rinkeby.etherscan.io/tx/0xcf2c71949f2078ad94c35233643bc842f34aa0925836a7afa784814db4cd1693

requestRandomWords

https://rinkeby.etherscan.io/tx/0xdda753f909ba441f8cf62f82e7e3e8beccde37951fd39574b32e02773cc4a994

### Deploy 0.6 - String

https://rinkeby.etherscan.io/tx/0x1346431cc24f22f6937453de35d204c7a43158404cefdebe70de114397944610

0xcfAac08133da18ba08C67099E97078A7481b4b25

send 2 LINK

https://rinkeby.etherscan.io/tx/0xc777fc1ab52f1d1f41f294dd1723ed915441846b748ea968cb62fef18c9dfb84

topUpSubscription

https://rinkeby.etherscan.io/tx/0xff0a908d345347e62b2e8cb694e7e8a72ef8b62ab0a85397b4db4707037e389a

requestRandomWords("Polkastarter Project 1")

https://rinkeby.etherscan.io/tx/0x7bebe9002c2fe2398e182d4c2fac105ed95b98d9207cde5bda7190e7be18e714

RAMDOM_REQUESTER_ROLE : 0x427D0A2c65eB5d146ED3b9e913A2eB0eac334B64

0xd51ceac178b03cb5d6683c46fba190997c1489058e7e4d7e7878c128a7ed86a0

https://rinkeby.etherscan.io/tx/0xf4e2928a7c7281411248aefdc0d1041ab6b40a94d0af94911a5778de301228a2

### Deploy Mainnet

```
$ yarn run deploy --network mainnet
deploying to network with chainId : 1
RandomSeed deployed to:  0x4C6fA38C9F6c19a640A673c7EA45b1e89101c5E7
deploy blocknumber   = 14996808
current block number = 14996808
waiting 10 blocks ...

Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/RandomSeed.sol:RandomSeed at 0x4C6fA38C9F6c19a640A673c7EA45b1e89101c5E7
for verification on the block explorer. Waiting for verification result...

Successfully verified contract RandomSeed on Etherscan.
https://etherscan.io/address/0x4C6fA38C9F6c19a640A673c7EA45b1e89101c5E7#code

```

https://etherscan.io/address/0x4C6fA38C9F6c19a640A673c7EA45b1e89101c5E7#code

`subscriptionID = 172`
`subscriptionID = 183`

### Fund subscription

https://vrf.chain.link/mainnet/183
