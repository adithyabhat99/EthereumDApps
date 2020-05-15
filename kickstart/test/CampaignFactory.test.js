const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
let compiledFactory = require("../ethereum/build/CampaignFactory.json");
let compiledCampaign = require("../ethereum/build/Campaign.json");

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: "0x" + compiledFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "4612388",
    });
  await factory.methods.createCampaign("contract1", 100).send({
    from: accounts[0],
    gas: "4612388",
  });
  campaignAddress = await factory.methods.deployedCampaigns("contract1").call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deplys factory and campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it("marks caller as campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });
  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "100",
      from: accounts[1],
    });
    const contributed = await campaign.methods.approvers(accounts[1]).call();
    assert.equal(contributed, 100);
  });
  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "99",
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
  it("allows manager to create a request", async () => {
    await campaign.methods
      .createRequest("pay rent", web3.utils.toWei("0.01", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "4612388",
      });
    const {
      description,
      value,
      recipient,
      complete,
      approvalCount,
    } = await campaign.methods.requests(0).call();
    assert.equal(description, "pay rent");
    assert.equal(value, web3.utils.toWei("0.01", "ether"));
    assert.equal(recipient, accounts[2]);
    assert.equal(complete, false);
    assert.equal(approvalCount, 0);
  });
  it("processes requests", async () => {
    let oldBalance = await web3.eth.getBalance(accounts[3]);
    oldBalance = web3.utils.fromWei(oldBalance, "ether");
    oldBalance = parseFloat(oldBalance);
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });
    await campaign.methods
      .createRequest("pay rent", web3.utils.toWei("1", "ether"), accounts[3])
      .send({
        from: accounts[0],
        gas: "4612388",
      });
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "4612388",
    });
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "4612388",
    });
    let newBalance = await web3.eth.getBalance(accounts[3]);
    newBalance = web3.utils.fromWei(newBalance, "ether");
    newBalance = parseFloat(newBalance);
    assert(newBalance > oldBalance);
  });
});
