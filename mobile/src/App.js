import React, { Component } from 'react';
import { Text, View, AsyncStorage } from 'react-native';
import createRootNavigator from './routes'
import { Provider } from 'react-redux'
import Socket from './socket'
import { persistor, store } from './configureStore'
import { PersistGate } from 'redux-persist/es/integration/react'
import { RSA } from 'react-native-rsa-native';
import OneSignal from 'react-native-onesignal'
// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

const SplashScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f0f' }}><Text>Loading</Text></View>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { gateLifted: false }
    OneSignal.init("0596fb61-668e-4d9a-ba3a-3d5a3de4e16a");
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  async onBeforeLift() {
    const token = await AsyncStorage.getItem('token');
    this.MainNavigator = createRootNavigator(token);
    if (!token) {
      console.log('stvaram nove tokene')
      const keys = await RSA.generateKeys(4096)
      await AsyncStorage.setItem('private_key', keys.private)
      await AsyncStorage.setItem('public_key', keys.public)
    }
    this.setState({ gateLifted: true })
  }

  renderMainNavigator() {
    const MainNavigator = this.MainNavigator
    return <MainNavigator />
  }

  render() {
    const { gateLifted } = this.state
    return (
      //<View style={{ flex: 1, backgroundColor: '#f0f' }}><Text>odasdasdask</Text></View>
      <Provider store={store}>
        <PersistGate
          onBeforeLift={() => this.onBeforeLift()}
          persistor={persistor}>
          {gateLifted && (
            <Socket>
              {this.renderMainNavigator()}
            </Socket>
          )}
          {!gateLifted && <SplashScreen />}
        </PersistGate>
      </Provider >
    );

  }
}