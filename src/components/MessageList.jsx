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

  toggleDownload(messageId, name) {
    console.log(messageId);
    axios
      .get("http://localhost:55602/GetFile?messageId=".concat(messageId), {
        responseType: "blob",
        headers: {
          Authorization: "bearer " + this.props.user.data.access_token
        }
      })
      .then(response => {
        const blob = new Blob([response.data]);
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.id = "dwnld";
        document.body.appendChild(a);
        document.getElementById("dwnld").click(function(e) {
          e.preventDefault();
        });
        a.href = url;
        a.download = name;
        a.click();
      });
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
                      title="Download file"
                      onClick={() => {
                        this.toggleDownload(message.Id, message.Content);
                      }}
                    ></img>
                    <i>{message.Content}</i>
                  </span>
                ) : (
                  message.Content
                )}
              </div>
              <div className="message-time">
                {moment(message.Time).format("HH:mm:ss")}
                <img
                  src="/trashBin.png"
                  alt="Delete"
                  id="btnDelete"
                  title="Delete message"
                  onClick={() => {
                    this.props.handleDeleteMessage(message);
                  }}
                ></img>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default MessageList;
