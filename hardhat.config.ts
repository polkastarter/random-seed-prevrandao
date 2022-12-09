import "./tasks/accounts";
import "./tasks/deploy";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import "solidity-coverage";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
const privateKey: string | undefined = process.env.PRIVATE_KEY;
if (!mnemonic && !privateKey) {
  throw new Error("Please set your MNEMONIC or PRIVATE_KEY in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const chainIds = {
  arbitrumOne: 42161,
  avalanche: 43114,
  bsc: 56,
  hardhat: 31337,
  mainnet: 1,
  optimism: 10,
  polygon: 137,
  rinkeby: 4,
};

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url: string = "https://" + network + ".infura.io/v3/" + infuraApiKey;

  const networkUserConfig: NetworkUserConfig = {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url,
  };

  if (privateKey) {
    networkUserConfig.accounts = [privateKey];
  }

  return networkUserConfig;
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  etherscan: {
    apiKey: {
      // arbitrumOne: process.env.ARBSCAN_API_KEY,
      // avalanche:   process.env.SNOWTRACE_API_KEY,
      // bsc:         process.env.BSCSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      // optimisticEthereum: process.env.OPTIMISM_API_KEY,
      // polygon:     process.env.POLYGONSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY || "",
    },
  },

  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },

  abiExporter: {
    path: "./abi",
    runOnCompile: true,
    clear: true,
    flat: true,
    // only: [':ERC20$'],
    spacing: 2,
    pretty: false,
  },

  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    arbitrumOne: getChainConfig("arbitrumOne"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism"),
    polygon: getChainConfig("polygon"),
    rinkeby: getChainConfig("rinkeby"),
  },

  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },

  solidity: {
    compilers: [
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.17",
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: "none",
          },
          // You should disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
};

export default config;
