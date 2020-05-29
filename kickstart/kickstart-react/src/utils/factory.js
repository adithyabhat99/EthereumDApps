import web3 from "./web3";
import CampaignFactory from "../ethereum_build/CampaignFactory.json";
import factory from "../ethereum_build/factoryAddress.json";

const instance = new web3.eth.Contract(CampaignFactory.abi, factory.address);

export default instance;
