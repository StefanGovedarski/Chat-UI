import React, { Component } from "react";
import axios from "axios";
import "../styles/login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      grant_type: "password",
      registrationErrors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    const qs = require("querystring");

    const requestBody = {
      username: this.state.username,
      password: this.state.password,
      grant_type: this.state.grant_type
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    axios
      .post("http://localhost:55602/token", qs.stringify(requestBody), config)
      .then(response => {
        if (response.status === 200) {
          this.props.handleSuccessfullAuth({
            user: this.state.username,
            data: response.data
          });
        }
      })
      .catch(error => {
        console.log("error", error);
      });

    event.preventDefault();
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="imgcontainer">
            <img src="/loginImg.png" alt="Avatar" className="login" />
          </div>
          <div className="container">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              ></input>
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              ></input>
            </div>
            <div>
              <button type="submit">Login</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
