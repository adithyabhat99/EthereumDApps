const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { bytecode, interface } = require("./compile");
const config = require("./config.js");

const provider = new HDWalletProvider(config.mnemonic, config.url);
const web3 = new Web3(provider);
const minEntryFee = 100;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const response = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
      arguments: [minEntryFee],
    })
    .send({ from: accounts[0] /*,gas: "4710000"*/ });
  console.log("Contract deployed to ", response.options.address);
  console.log(interface);
};

deploy();
