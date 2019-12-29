import React, { Component } from "react";
import "./styles/MessagePanel.css";
import MessageList from "./MessageList";

class MessagePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: "",
      selectedFile: null,
      maxFileSize: 15000
    };

    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.fileUpload = React.createRef();
  }

  handleFileChosen(event) {
    if (event.target.files.length <= 0) {
      return;
    }
    if (event.target.files[0].size > this.maxFileSize) {
      return;
    }
    this.props.handleMessageSent(
      event.target.files[0].name,
      true,
      event.target.files[0]
    );
    this.setState({
      selectedFile: event.target.files[0]
    });
  }

  toggleUpload() {
    this.fileUpload.current.click();
  }

  handleMessageChange(event) {
    this.setState({ currentMessage: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    var currentMessage = this.state.currentMessage;

    if (currentMessage.length === 0) {
      return;
    }

    this.props.handleMessageSent(currentMessage);
    this.setState({
      currentMessage: ""
    });
  }

  render() {
    return (
      <div id="chat-message-list">
        <MessageList
          messages={this.props.messages}
          isFullChatHistory={this.props.isFullChatHistory}
          handleLoadHistory={this.props.handleLoadHistory}
        />
        <div id="message-form">
          <form onSubmit={this.handleSubmit} id="chat-form" autoComplete="off">
            <span>
              <img
                id="btnAttach"
                src="/attachment-logo.svg"
                alt="Attach File"
                onClick={this.toggleUpload}
              />
              <div className="wrapperHidden">
                <input
                  type="file"
                  id="uploadfile"
                  ref={this.fileUpload}
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
text/plain, application/pdf, image/*"
                  onChange={this.handleFileChosen}
                />
              </div>
              <input
                type="text"
                value={this.state.currentMessage}
                onChange={this.handleMessageChange}
                id="msg"
                placeholder="Your message"
              />
              <button
                disabled={this.props.conversationSelected === 0 ? true : false}
                id="btnSend"
              >
                Send
              </button>
            </span>
          </form>
        </div>
      </div>
    );
  }
}

export default MessagePanel;
