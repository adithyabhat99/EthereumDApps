import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class campaignList extends Component {
  render() {
    const { names, addresses } = this.props;
    return (
      <div className="campaign-list">
        {names.map((name, index) => {
          return (
            <Link
              key={index}
              to={addresses[index] ? `/campaigns/${addresses[index]}` : "/"}
            >
              <div className="campaign-item">
                <p className="campaign-name">{name}</p>
                {addresses[index] ? (
                  <p className="campaign-address">
                    Address: {addresses[index]}
                  </p>
                ) : (
                  <p className="address-loading">Address is loading...</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
}
