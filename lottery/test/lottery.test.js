// This test will run in the local ethereum network run by ganache
// ganache will give the provider to web3 instance
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { bytecode, interface } = require("../compile");

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let lottery;
const minEntryFee = web3.utils.toWei("4", "ether");

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // use one of those accounts to deploy the contract
  lottery = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
      arguments: [minEntryFee],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("lottery", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });
  it("allows one account to enter to the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: minEntryFee,
    });
    const count = await lottery.methods.getCount().call({
      from: accounts[0],
    });
    assert.equal(count, 1);
  });
  it("allows multiple accounts to enter to the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: minEntryFee,
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: minEntryFee,
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: minEntryFee,
    });
    const count = await lottery.methods.getCount().call({
      from: accounts[0],
    });
    assert.equal(count, 3);
  });
  it("requires entry fee", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0,
      });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });
  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().call({
        from: accounts[1],
      });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });
  it("sends money to winner and resets the player array", async () => {
    // enter 1 user
    await lottery.methods.enter().send({
      from: accounts[0],
      value: minEntryFee,
    });
    const balanceBefore = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    const balanceAfter = await web3.eth.getBalance(accounts[0]);
    const difference = balanceAfter - balanceBefore;
    assert(difference > web3.utils.toWei("3.5", "ether"));
    const count = await lottery.methods.getCount().call({
      from: accounts[0],
    });
    assert.equal(count, 0);
  });
});
