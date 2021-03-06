const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");
const config = require("./config.js");
const fs = require("fs");
const path = require("path");

const provider = new HDWalletProvider(config.mnemonic, config.url);
const web3 = new Web3(provider);
const minEntryFee = 100;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const response = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: "0x" + compiledFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "4612388",
    });
  const address = response.options.address;
  console.log("Contract deployed to ", address);
  const outPath = path.resolve(__dirname, "build", "factoryAddress.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({
      address,
    })
  );
  process.exit(1);
};

deploy();
