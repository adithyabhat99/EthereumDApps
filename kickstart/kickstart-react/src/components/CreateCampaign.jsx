import React, { Component } from "react";

export default class CreateCampaign extends Component {
  state = {
    name: "",
    cont: "",
  };
  handleNameChange = (e) => {
    const name = e.target.value;
    this.setState({ name });
  };
  handleContChange = (e) => {
    const cont = e.target.value;
    this.setState({ cont });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const name = this.state.name;
    const cont = parseInt(this.state.cont);

    this.setState({ name: "", cont: "" });
  };
  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit} className="form-create">
          <label htmlFor="">Name</label>
          <input
            type="text"
            value={this.state.name}
            id="name"
            onChange={this.handleNameChange}
          />
          <label htmlFor="cont">Minimum contribution in Wei</label>
          <input
            type="text"
            value={this.state.cont}
            id="cont"
            onChange={this.handleContChange}
          />
          <button className="create-button">Create</button>
        </form>
      </>
    );
  }
}
