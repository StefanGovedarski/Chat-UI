import React, { Component } from "react";
import Registration from "./auth/Registration";
import Login from "./auth/Login";
import "./styles/login.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signin: true,
      btnTxt: "Or Register",
      btnHolder: "Or Sing In"
    };

    this.handleSuccessfullAuth = this.handleSuccessfullAuth.bind(this);
    this.handleSigningPages = this.handleSigningPages.bind(this);
  }

  handleSuccessfullAuth(data) {
    this.props.handleLogin(data);
    this.props.history.push("/chatpanel");
  }

  handleSigningPages() {
    var placeholder = this.state.btnHolder;

    this.setState({
      signin: !this.state.signin,
      btnHolder: this.state.btnTxt,
      btnTxt: placeholder
    });
  }

  render() {
    return (
      <div className="home">
        {this.state.signin ? (
          <Login handleSuccessfullAuth={this.handleSuccessfullAuth} />
        ) : (
          <Registration handleSuccessfullAuth={this.handleSuccessfullAuth} />
        )}
        <div className="footer">
          <input
            type="button"
            onClick={this.handleSigningPages}
            value={this.state.btnTxt}
            className="secondaryBtn"
          ></input>
        </div>
      </div>
    );
  }
}

export default Home;
