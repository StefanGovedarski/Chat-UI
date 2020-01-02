import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import axios from "axios";
import ChatPanel from "./ChatPanel";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin(data) {
    this.setState({
      user: data
    });
  }

  handleLogout() {
    this.setState({
      user: {}
    });
  }

  userLogout() {
    const URL = "http://localhost:55602/Logout";
    axios.get(
      URL,
      {
        headers: {
          Authorization: "bearer " + this.state.user.data.access_token
        }
      },
      { crossdomain: true }
    );
  }

  componentDidMount() {
    window.addEventListener("beforeunload", () => {
      this.userLogout();
    });
  }

  componentWillUnmount() {
    window.addEventListener("beforeunload", () => {
      this.userLogout();
    });
  }

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path={"/"}
              render={props => (
                <Home {...props} handleLogin={this.handleLogin} />
              )}
            />
            <Route
              exact
              path={"/chatpanel"}
              render={props => (
                <ChatPanel
                  {...props}
                  user={this.state.user}
                  handleLogout={this.handleLogout}
                />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
