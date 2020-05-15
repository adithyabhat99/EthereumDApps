const path = require("path");
const fs = require("fs");
const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "contracts", "lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "lottery.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "lottery.sol"
]["Lottery"];

module.exports = {
  bytecode: "0x" + output.evm.bytecode.object,
  interface: output.abi,
};
