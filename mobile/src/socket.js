import React, { Component } from 'react'
import { View, AsyncStorage, AppState } from 'react-native'
import { connect } from 'react-redux'
import { encryptMessages, storeMessages } from './action/message.action'
import { baseSocketURL } from './env'
import { storeConversation, getConversations } from './action/conversation.action';

class Socket extends Component {

  constructor(props) {
    super(props)
    this.reconnect = true
    this.state = {
      appState: AppState.currentState
    }
  }

  componentWillMount() {
    this.setPrivateKey()
    if (this.props.auth.token && !this.connected) {
      this.connect()
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', () => this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', () => this._handleAppStateChange);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.auth.token && !this.connected) {
      this.connect()
    }
  }

  _handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.connect()
    }
    else {
      this.disconnect()
    }
    this.setState({ appState: nextAppState });
  };

  async disconnect() {
    const token = await AsyncStorage.getItem('token')
    this.reconnect = false
    this.send(JSON.stringify({ token, type: 'DISCONNECT' }))
    this.ws.close()
  }

  async connect() {
    this.connected = true
    this.reconnect = true
    const token = await AsyncStorage.getItem('token')
    console.log('CONNECTIONG')
    this.ws = new WebSocket(baseSocketURL)
    this.ws.onopen = () => { this.send(JSON.stringify({ token, type: 'CONNECT' })) }
    this.ws.onmessage = (event) => { this.decryptMessage(JSON.parse(event.data)) }
    this.ws.onerror = (error) => { }
    this.ws.onclose = () => {
      this.connected = false
      if (this.reconnect) {
        setTimeout(this._handleWebSocketSetup, 3000)
      }
    }
  }

  async decryptMessage(message) {
    const { conversationId } = message
    const { conversations } = this.props.conversation
    const conversation = conversations[conversationId]
    if(conversation) conversation.lastMessageId = message.id
    const messages = await encryptMessages([message])
    storeMessages(messages, conversationId)
    if(!conversations[message.conversationId]) {
      getConversations()
    }
    //storeConversation(message.conversation)
  }

  async setPrivateKey() {
    this.privateKey = await AsyncStorage.getItem('private_key')
  }

  send(data) {
    this.ws.send(data)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
      </View>
    )
  }
}

const mapStateToProps = ({ auth, conversation }) => {
  return { auth, conversation }
}
export default connect(mapStateToProps)(Socket)