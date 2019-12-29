import React, { Component } from "react";
import "./styles/ConversationSearch.css";
import axios from "axios";

class ConversationSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      results: []
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange = () => {
    this.setState(
      {
        query: this.search.value.trim()
      },
      () => {
        if (this.state.query && this.state.query.length > 1) {
          this.getInfo();
        }
      }
    );
  };

  getInfo = () => {
    const URL = "http://localhost:55602/FindUsers?searchQuery=".concat(
      this.state.query
    );

    axios
      .get(
        URL,
        {
          headers: {
            Authorization: "bearer " + this.props.user.data.access_token
          }
        },
        { crossdomain: true }
      )
      .then(response => {
        if (response.status === 200) {
          this.props.toggleSearchOn();
          this.setState({ results: response.data });
        }
      })
      .catch(error => {
        console.log("error " + error);
      });
  };

  render() {
    return (
      <div id="search-container">
        <input
          type="text"
          placeholder="Search"
          ref={input => (this.search = input)}
          onChange={this.handleSearchChange}
        />
        {this.state.results.length > 0 && this.props.searchResults && (
          <div className="result">
            {this.state.results.map((result, i) => (
              <li
                key={i}
                className="result-item"
                onClick={() =>
                  this.props.handleConversationChange(result.Username)
                }
              >
                {result.Username +
                  " - " +
                  result.Firstname +
                  " " +
                  result.Lastname}
              </li>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ConversationSearch;
