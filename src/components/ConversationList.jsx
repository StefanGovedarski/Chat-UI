import React, { Component } from "react";
import Conversation from "./Conversation";
import "./styles/ConversationList.css";

class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="container-conversation-list">
        {this.props.conversations.map(item => (
          <Conversation
            key={item.ConversationId}
            conversation={item}
            IsActive={item.ConversationId === this.props.conversationSelected}
            handleConversationChange={this.props.handleConversationChange}
          />
        ))}
      </div>
    );
  }
}

export default ConversationList;
