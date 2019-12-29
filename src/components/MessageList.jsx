import React, { Component } from "react";
import moment from "moment";
import ReactDOM from "react-dom";
import axios from "axios";
import "./styles/MessagePanel.css";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 25
    };

    this.handleLoadHistoryClick = this.handleLoadHistoryClick.bind(this);
    this.toggleDownload = this.toggleDownload.bind(this);
  }

  componentDidUpdate() {
    const node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }

  handleLoadHistoryClick() {
    var countToUpdate = this.state.count + 25;
    this.props.handleLoadHistory(countToUpdate);
    this.setState({
      count: countToUpdate
    });
  }

  toggleDownload(messageId) {
    console.log(messageId);
  }

  render() {
    return (
      <div id="chat-messages">
        {!this.props.isFullChatHistory && (
          <button
            id="loadHistory"
            type="button"
            onClick={this.handleLoadHistoryClick}
          >
            Load previous
          </button>
        )}
        {this.props.messages.map((message, i) => (
          <div
            key={i}
            className={
              "message-row " +
              (message.IsMine ? "you-message" : "other-message")
            }
          >
            <div className="message-content">
              <b>
                <i>{message.Sender}</i>
              </b>
              <div className="message-text">
                {message.IsAttachment ? (
                  <span>
                    <img
                      src="/downArrow.png"
                      alt="Download"
                      id="btnDownload"
                      onClick={this.toggleDownload(message.Content)}
                    ></img>
                    <i>{message.Content}</i>
                  </span>
                ) : (
                  message.Content
                )}
              </div>
              <div className="message-time">
                {moment(message.Time).format("HH:mm:ss")}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default MessageList;
