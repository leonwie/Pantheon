/* @flow */
import React, {Component} from 'react'
import {
  View,
  StatusBar
} from 'react-native'
import firebase from 'firebase'
import {
  StackNavigator,
  DrawerNavigator
} from 'react-navigation'

import StandingsScreen      from './Standings/Standings'
import CalendarScreen       from './Calendar/Calendar'
import SlideMenu            from './Components/SlideMenu'

const MainScreen = DrawerNavigator(
  {
    Standings: {
      path: '/standings',
      screen: StandingsScreen
    },
    Calendar: {
      path: '/calendar',
      screen: CalendarScreen
    }
  },
  {
    contentComponent: SlideMenu,
    drawerPosition: 'left',
    initialRouteName: 'Standings',
    contentOptions: {
      activeTintColor: '#e91e63'
    },
    style: {
      backgroundColor: '#202930'
    }
  }
)

const F1Routes = {
  MainScreen: {
    name: 'MainScreen',
    screen: MainScreen
  }
}

const AppNavigator = StackNavigator(
  {
    ...F1Routes,
    Index: {
      screen: MainScreen
    }
  },
  {
    initialRouteName: 'Index',
    headerMode: 'none',

    /*
     * Use modal on iOS because the card mode comes from the right,
     * which conflicts with the drawer example gesture
     */
    mode: 'card'
  }
)


class app extends Component {
  componentWillMount() {
    const config = {
      apiKey: "AIzaSyCAnkKBia6Jd8REycaDryC2AY5Jj_NQBpQ",
      authDomain: "formula-1-7a0c8.firebaseapp.com",
      databaseURL: "https://formula-1-7a0c8.firebaseio.com",
      projectId: "formula-1-7a0c8",
      storageBucket: "formula-1-7a0c8.appspot.com",
      messagingSenderId: "708407712539"
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
        <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={'#202930'} />
        <AppNavigator />
      </View>  
    );
  }
}

export default app