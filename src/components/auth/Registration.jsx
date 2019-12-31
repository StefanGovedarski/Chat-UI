import React, { Component } from "react";
import axios from "axios";
import "../styles/login.css";

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      passwordConfirmation: "",
      firstname: "",
      lastname: "",
      registrationErrors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    axios
      .post("http://localhost:55602/Register", {
        username: this.state.username,
        password: this.state.password,
        confirmPassword: this.state.passwordConfirmation,
        firstname: this.state.firstname,
        lastname: this.state.lastname
      })
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
            <img src="/loginImg.png" alt="Avatar" />
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
              {" "}
              <input
                type="password"
                name="passwordConfirmation"
                placeholder="Confirm Password"
                value={this.state.passwordConfirmation}
                onChange={this.handleChange}
                required
              ></input>
            </div>
            <div>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={this.state.firstname}
                onChange={this.handleChange}
                required
              ></input>
            </div>
            <div>
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={this.state.lastname}
                onChange={this.handleChange}
                required
              ></input>
            </div>
            <div>
              <button type="submit">Register</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Registration;
