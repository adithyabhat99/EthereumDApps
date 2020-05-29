import React, { Component } from "react";

export default class Campaign extends Component {
  render() {
    const { address } = this.props.match.params;
    return <div>This is from campaign!</div>;
  }
}
