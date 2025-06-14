require("@nomicfoundation/hardhat-toolbox-viem");
require("@nomicfoundation/hardhat-ignition-viem");
require("dotenv/config");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      metadata: {
        bytecodeHash: "none", // disable ipfs
        useLiteralContent: true, // use source code
      },
    },
  },
  networks: {
    monadTestnet: {
      url: "https://testnet-rpc.monad.xyz",
      accounts: [PRIVATE_KEY],
      chainId: 10143,
    },
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com",
  },
  // To avoid errors from Etherscan
  etherscan: {
    enabled: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 