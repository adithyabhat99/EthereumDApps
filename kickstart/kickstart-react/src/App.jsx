import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import "./App.css";
import { CampaignList, Campaign, CreateCampaign } from "./components";
import factory from "./utils/factory";
export default class App extends Component {
  state = {
    names: [],
    addresses: [],
    loading: true,
    toggle: false,
  };
  getAddresses = async (n) => {
    let addresses = [];
    for (let i = 0; i < n; i++) {
      let address = await factory.methods.getAddressOf(i).call();
      addresses.push(address);
    }
    this.setState({ addresses });
  };
  async componentDidMount() {
    const n = await factory.methods.getLength().call();
    // getting address is not so important
    this.getAddresses(n);
    let names = [];
    for (let i = 0; i < n; i++) {
      let name = await factory.methods.campaigns(i).call();
      names.push(name);
    }
    this.setState({ names, loading: false });
  }
  handleToggle = () => {
    this.setState({ toggle: !this.state.toggle });
  };
  render() {
    return (
      <Router>
        <nav className="navbar">
          <span className="navbar-toggle" onClick={this.handleToggle}>
            <i className="fas fa-bars"></i>
          </span>
          <ul className={this.state.toggle ? "main-nav active" : "main-nav"}>
            <li>
              <NavLink
                exact
                to="/"
                className="nav-links"
                activeClassName="is-active"
              >
                Campaigns
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contributions"
                className="nav-links"
                activeClassName="is-active"
              >
                Your Contributions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my/campaigns"
                className="nav-links"
                activeClassName="is-active"
              >
                Your Campaigns
              </NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <>
              {/* <h1 className="header">Welcome to Kickstarter!</h1> */}
              <div className="header-box">
                <h2 className="header">Campaigns</h2>
                <NavLink to="/create/campaign">
                  <button className="create-button">
                    <span className="add-icon">
                      <i className="fas fa-plus" />
                    </span>{" "}
                    Create Campaign
                  </button>
                </NavLink>
              </div>
              <CampaignList
                names={this.state.names}
                addresses={this.state.addresses}
              />
              {this.state.loading ? (
                <p className="loading">loading campaigns....</p>
              ) : null}
            </>
          </Route>
          <Route path="/campaigns/:address" component={Campaign} />
          <Route path="/create/campaign" component={CreateCampaign} />
        </Switch>
      </Router>
    );
  }
}
