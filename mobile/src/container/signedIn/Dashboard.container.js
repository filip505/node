import React, { Component } from 'react'
import { View, StyleSheet, Button, AppState } from 'react-native'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import UserItem from '../../component/user.item'
import { logout } from '../../action/auth.action'
import { getConversations } from '../../action/conversation.action'
import { isLoading, isSuccess } from '../../util/actionPhaseUtil'

class Dashboard extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Message',
    headerLeft: <Button title='logout' onPress={() => { logout(), navigation.navigate('SignedOut') }}></Button>,
    headerRight: <Button title='add Contact' onPress={() => { navigation.navigate('AddContact') }}></Button>
  });

  constructor(props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    getConversations()
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      getConversations()
    }
    this.setState({ appState: nextAppState });
  }

  renderConversation(conversation, user, messages) {
    let message = { text: 'New Message' }
    if (messages) {
      message = (messages[conversation.lastMessageId]) ? messages[conversation.lastMessageId] : { text: 'New Message' }
    }

    return (
      <View>
        {user && <UserItem
          conversation={conversation}
          user={user}
          message={message}
          onPress={() => this.props.navigation.navigate('Message', { userId: user.number, conversationId: conversation.id })}
          style={{ height: 100, marginHorizontal: 5, marginTop: 5 }} />}
      </View>
    )
  }

  render() {
    const { user, message, conversation } = this.props
    return (
      <View style={{ flex: 1 }}>

        <FlatList style={styles.list}
          data={Object.values(conversation).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))}
          renderItem={({ item }) => this.renderConversation(item, user[item.companionId], message[item.id])}
          keyExtractor={(conversation) => conversation.id}
        />

      </View>
    )
  }
}

const mapStateToProps = ({ conversation, user, message, auth }) => {
  return { conversation, user, message, auth }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  }
})

export default connect(mapStateToProps)(Dashboard)