import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
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
