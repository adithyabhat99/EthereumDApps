const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "inbox.sol": {
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
  "inbox.sol"
]["Inbox"];

// We need to get the bytecode from the output retured by solc
// solc expects many solidity contracts, we have only 1 here
// output.contracts["inbox.sol"]["Inbox"].evm.bytecode.object
// here inbox.sol is the source specified in input, Inbox is the actual contract
// evm -> bytecode -> object contains actual bytecode
// evm -> bytecode actually has other things like assembly, opcodes etc too
module.exports = {
  bytecode: "0x" + output.evm.bytecode.object,
  interface: output.abi,
};

// const output = JSON.parse(solc.compile(JSON.stringify(input)));

// // `output` here contains the JSON output as specified in the documentation
// for (let contractName in output.contracts["inbox.sol"]) {
//   console.log(
//     contractName +
//       ": " +
//       output.contracts["inbox.sol"][contractName].evm.bytecode.object
//   );
// }
