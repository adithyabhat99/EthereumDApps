const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const campaignPath = path.resolve(
  __dirname,
  "contracts",
  "CampaignFactory.sol"
);

const source = fs.readFileSync(campaignPath, "utf8");
const input = {
  language: "Solidity",
  sources: {
    "CampaignFactory.sol": {
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
  "CampaignFactory.sol"
];

// delete entire build folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
// create build directory again
fs.ensureDirSync(buildPath);
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + ".json"),
    output[contract]
  );
}
