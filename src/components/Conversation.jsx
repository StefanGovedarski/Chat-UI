import React, { Component } from "react";
import "./styles/Conversation.css";

class Conversation extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const conversation = this.props.conversation;
    return (
      <div
        onClick={() => this.props.handleConversationChange(conversation.ToUser)}
        className={"conversation" + (this.props.IsActive ? " active" : "")}
      >
        <div className="title-text">{conversation.ToUser}</div>
        <div className="title-text">
          {conversation.ToUserFirstName + " " + conversation.ToUserLastName}
        </div>
        <div className="last-updated">{conversation.LastUpdated}</div>
      </div>
    );
  }
}

export default Conversation;
