import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    count: 0,
    balance: "",
    value: "",
    message: false,
    account: "",
  };
  init = async () => {
    let [manager, count, balance, value, accounts] = await Promise.all([
      lottery.methods.manager().call(),
      lottery.methods.getCount().call(),
      web3.eth.getBalance(lottery.options.address),
      lottery.methods.ticketPrice().call(),
      web3.eth.getAccounts(),
    ]);
    value = web3.utils.fromWei(value, "ether");
    this.setState({
      manager,
      count,
      balance,
      value,
      account: accounts[0],
    });
  };
  async componentDidMount() {
    await this.init();
  }
  async componentDidUpdate() {
    await this.init();
  }
  setMessage = (message) => {
    this.setState({
      message,
    });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const { value } = this.state;
    this.setMessage("Transaction pening....It will take less than a minute");
    try {
      await lottery.methods.enter().send({
        from: this.state.account,
        value: web3.utils.toWei(value, "ether"),
      });
      this.setMessage("Entered to lottery succesfully!");
    } catch (error) {
      console.log(error);
      this.setMessage("Error entering to lottery :(");
    }
  };
  handleWinner = async (event) => {
    event.preventDefault();
    this.setMessage("Picking a winner...");
    try {
      await lottery.methods.pickWinner().send({
        from: this.state.account,
      });
      this.setMessage("A winner has been picked!");
    } catch (error) {
      console.log(error);
      this.setMessage("Error picking a winner :(");
    }
  };
  render() {
    return (
      <div>
        <h2>Lottery contract</h2>
        <p> This contract is managed by {this.state.manager}</p>

        <p>
          There are <b>{this.state.count}</b> players
        </p>

        <p>
          Lottery value is{" "}
          <b>{web3.utils.fromWei(this.state.balance, "ether")} ethers</b>
        </p>
        <hr />
        <form>
          <h4>Want to try your luck ?</h4>
          <div>
            <label>Your bet!</label>
            <input
              type="text"
              onChange={(event) => this.setState({ value: event.target.value })}
              value={this.state.value}
            />
            <label>In ethers</label>
          </div>
          <button onClick={this.handleSubmit}>Enter</button>
        </form>
        <hr />
        <h3>{this.state.message}</h3>
        <hr />
        {this.state.account === this.state.manager ? (
          <button onClick={this.handleWinner}>Pick a winner!</button>
        ) : null}
      </div>
    );
  }
}

export default App;
