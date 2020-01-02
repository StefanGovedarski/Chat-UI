import React, { Component } from "react";
import "./styles/ChatPanel.css";
import ConversationSearch from "./ConversationSearch";
import ConversationList from "./ConversationList";
import MessagePanel from "./MessagePanel";
import axios from "axios";
import moment from "moment";
import * as signalr from "signalr-no-jquery";
// import * as $ from "jquery";

class ChatPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useSignalR: false,
      searchResults: false,
      conversationSelected: 0,
      conversations: [],
      messages: [
        {
          ConversationId: 0,
          Sender: this.props.user.user,
          Date: moment(),
          Content:
            "Hi " +
            this.props.user.user +
            ".Select a user to chat with from the conversation list! :)",
          IsMine: true,
          IsAttachment: false
        }
      ],
      targetUsername: "",
      isFullChatHistory: true,
      chatHub: null
    };

    this.toggleSearchOn = this.toggleSearchOn.bind(this);
    this.toggleSearchOff = this.toggleSearchOff.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleConversationChange = this.handleConversationChange.bind(this);
    this.handleMessageSent = this.handleMessageSent.bind(this);
    this.handleLoadHistory = this.handleLoadHistory.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleDeleteMessage = this.handleDeleteMessage.bind(this);
  }

  componentDidMount() {
    this.getConversationHistory();

    const connection = signalr.hubConnection(
      "http://localhost:55602/signalr/ChatHub"
    );
    const hubProxy = connection.createHubProxy("ChatHub");
    // connect
    connection
      .start({ jsonp: true })
      .done(() => console.log("SignalR Connected..."))
      .fail(error => console.log("Error: ", error));

    hubProxy.on("AddMessage", newMessage => {
      this.showMessage(newMessage);
    });

    hubProxy.on("SendFile", newMessage => {
      this.showMessage(newMessage);
    });

    this.setState({
      chatHub: hubProxy
    });
  }

  showMessage(message) {
    var messagesUpdated = this.state.messages;
    messagesUpdated.push(message);
    this.setState({
      messages: messagesUpdated
    });
  }

  handleDeleteMessage(message) {
    axios.get(
      "http://localhost:55602/DeleteMessage?messageId=".concat(message.Id),
      {
        headers: {
          Authorization: "bearer " + this.props.user.data.access_token
        }
      }
    );
    var currMesagges = this.state.messages;
    currMesagges.pop(message);

    this.setState({
      mesages: currMesagges
    });
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
        if (response.status === 200) {
          this.setState({
            conversations: response.data
          });
        }
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
            isFullChatHistory: resp.IsFullChatHistory,
            useSignalR: resp.TargetUserOnline,
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
    var date = moment();
    var newMessage = {
      ConversationId: this.state.conversationSelected,
      Sender: this.props.user.user,
      Date: date,
      Content: messageContent,
      IsMine: true,
      IsAttachment: isAttachment,
      Attachment: attachment
    };
    this.saveMessage(newMessage);

    if (!this.state.useSignalR) {
      console.log("call show message");
      this.showMessage(newMessage);
    }
  }

  saveMessage(newMessage) {
    if (this.state.useSignalR) {
      // Send via webSocket
      this.state.chatHub.invoke("AddMessage", newMessage);
    } else {
      // Persist message for offline user to see in a later time
      axios.post("http://localhost:55602/AddMessage", newMessage, {
        headers: {
          Authorization: "bearer " + this.props.user.data.access_token
        }
      });
    }
  }

  handleFileUpload(file) {
    if (this.state.useSignalR) {
      // Send via webSocket
      this.state.chatHub.invoke(
        "SendFile",
        file,
        this.props.user.user,
        this.state.conversationSelected
      );
    } else {
      axios
        .post(
          "http://localhost:55602/SaveFile?conversationId=".concat(
            this.state.conversationSelected
          ),
          file,
          {
            headers: {
              Authorization: "bearer " + this.props.user.data.access_token,
              "Content-Type": "multipart/form-data",
              type: "formData"
            }
          }
        )
        .then(response => {
          if (response.status === 200) {
            this.showMessage(response.data.message);
          }
        })
        .catch(error => {
          console.log("error " + error);
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
          handleDeleteMessage={this.handleDeleteMessage}
        />
        <button id="logout" onClick={() => this.handleLogoutClick()}>
          Logout
        </button>
      </div>
    );
  }
}

export default ChatPanel;
