// using infura api to connect to a ethereum node
// (here we are using Rinkeby test network)
// using truffle provider to connect infura's node to web3 instance
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { bytecode, interface } = require("./compile");
const config = require("./config.js");

const provider = new HDWalletProvider(config.mnemonic, config.url);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const response = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
      arguments: ["hello from adithya"],
    })
    .send({ from: accounts[0], gas: "1000000" });
  console.log("Contract deployed to ", response.options.address);
};

deploy();
