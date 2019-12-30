import React, { Component } from "react";
import "./styles/ChatPanel.css";
import ConversationSearch from "./ConversationSearch";
import ConversationList from "./ConversationList";
import MessagePanel from "./MessagePanel";
import axios from "axios";
import moment from "moment";

class ChatPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: false,
      conversationSelected: 0,
      conversations: [],
      messages: [
        {
          ConversationId: 0,
          Sender: this.props.user.user,
          Date: moment(),
          Content: "Select a user to chat with from the conversation list! :)",
          IsMine: true,
          IsAttachment: false
        }
      ],
      targetUsername: "",
      targetUserLoggedInStatus: false,
      isFullChatHistory: true
    };

    this.toggleSearchOn = this.toggleSearchOn.bind(this);
    this.toggleSearchOff = this.toggleSearchOff.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleConversationChange = this.handleConversationChange.bind(this);
    this.handleMessageSent = this.handleMessageSent.bind(this);
    this.handleLoadHistory = this.handleLoadHistory.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount() {
    this.getConversationHistory();
  }

  handleLoadHistory(count) {
    this.getChatData(this.state.targetUsername, count);
  }

  getConversationHistory() {
    axios
      .get("http://localhost:55602/ConversationHistory", {
        headers: {
          Authorization: "bearer " + this.props.user.data.access_token
        }
      })
      .then(response => {
        if (response.status === 200)
          this.setState({ conversations: response.data });
      })
      .catch(error => {
        console.log("error " + error);
      });
  }
  getChatData(targetUsername, messageCount = 25) {
    const URL = "http://localhost:55602/StartChat?targetUsername="
      .concat(targetUsername)
      .concat("&messageCount=")
      .concat(messageCount);

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
          const resp = response.data;
          this.setState({
            conversationSelected: resp.Conversation.Id,
            targetUsername: resp.TargetUsername,
            targetUserLoggedInStatus: resp.TargetUserOnline,
            isFullChatHistory: resp.IsFullChatHistory,
            messages: resp.Messages
          });
        }
      })
      .catch(error => {
        console.log("error " + error);
      });
  }

  handleMessageSent(messageContent, isAttachment = false, attachment = null) {
    if (this.state.conversationSelected === 0) {
      return;
    }
    console.log("ATTACHMEENT", attachment);
    var date = moment();
    var messagesUpdated = this.state.messages;
    var newMessage = {
      ConversationId: this.state.conversationSelected,
      Sender: this.props.user.user,
      Date: date,
      Content: messageContent,
      IsMine: true,
      IsAttachment: isAttachment,
      Attachment: attachment
    };
    messagesUpdated.push(newMessage);
    this.saveMessage(newMessage);
    this.setState({
      messages: messagesUpdated
    });
  }

  handleFileUpload(file) {
    axios
      .post("http://localhost:55602/SaveFile", file, {
        headers: {
          Authorization: "bearer " + this.props.user.data.access_token
        }
      })
      .then(response => {
        if (response.status === 200) {
          console.log("whole response", response);
          const resp = response.data;
          console.log("file responde data", resp);
        }
      })
      .catch(error => {
        console.log("error " + error);
      });
  }

  saveMessage(newMessage) {
    if (this.state.targetUserLoggedInStatus) {
      // Open SignalR websocket hub
    } else {
      // Persist message for offline user to see in a later time
      axios.post("http://localhost:55602/AddMessage", newMessage, {
        headers: {
          Authorization: "bearer " + this.props.user.data.access_token
        }
      });
    }
  }

  handleLogoutClick() {
    const URL = "http://localhost:55602/Logout";

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
        this.props.handleLogout();
        this.props.history.push("/");
      })
      .catch(error => {
        console.log("error " + error);
      });
  }

  toggleSearchOn() {
    this.setState({
      searchResults: true
    });
  }

  toggleSearchOff() {
    this.setState({
      searchResults: false
    });
  }

  handleConversationChange(targetUsername) {
    this.getChatData(targetUsername);
    this.getConversationHistory();
  }

  render() {
    return (
      <div id="container" onClick={this.toggleSearchOff}>
        <ConversationSearch
          user={this.props.user}
          searchResults={this.state.searchResults}
          toggleSearchOn={this.toggleSearchOn}
          handleConversationChange={this.handleConversationChange}
        />
        <ConversationList
          user={this.props.user}
          conversations={this.state.conversations}
          conversationSelected={this.state.conversationSelected}
          handleConversationChange={this.handleConversationChange}
        />
        <MessagePanel
          user={this.props.user}
          messages={this.state.messages}
          handleMessageSent={this.handleMessageSent}
          conversationSelected={this.state.conversationSelected}
          isFullChatHistory={this.state.isFullChatHistory}
          handleLoadHistory={this.handleLoadHistory}
          handleFileUpload={this.handleFileUpload}
        />
        <button id="logout" onClick={() => this.handleLogoutClick()}>
          Logout
        </button>
      </div>
    );
  }
}

export default ChatPanel;
