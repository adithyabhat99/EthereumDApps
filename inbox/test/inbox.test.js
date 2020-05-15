// This test will run in the local ethereum network run by ganache
// ganache will give the provider to web3 instance
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { bytecode, interface } = require("../compile");

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;
const initialMessage = "Hello from adithya!";

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
      arguments: [initialMessage],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, initialMessage);
  });
  it("can change the message", async () => {
    const message = "modified message";
    await inbox.methods.setMessage(message).send({ from: accounts[1] });
    const newMessage = await inbox.methods.message().call();
    assert.equal(newMessage, message);
  });
});
