/* @flow */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  View,
  StyleSheet,
  ListView,
  ActivityIndicator,
  AsyncStorage,
  RefreshControl,
  Platform,
  Image
} from 'react-native'

import ScalableText from 'react-native-text'
import moment from 'moment'

import StatsHeader from './StatsHeader'
import api from '../Utils/api'
import ErrorPage from '../Components/ErrorPage'

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
})

class DriversScreen extends Component {
  //Attempt to fetch drivers from api 
  // If this fails manually render all assets from assets folder
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      error: false,
      drivers: [],
      refreshing: false
    }

    // Bind internal functions, necessary in ES6 + React
    this.renderRow = this.renderRow.bind(this)
  }

  //attempt to fetch drivers from api
  getDrivers() {
    api.getDriverStandings()
      .then((driversStandings) => {
        const drivers = {
          standings: driversStandings,
          expireTime: moment().add(1, 'h').unix()
        }

        AsyncStorage.setItem('driversStandings', JSON.stringify(drivers))
          .then(() => {
            this.setState({
              isLoading: false,
              refreshing: false,
              error: false,
              drivers: ds.cloneWithRows(drivers.standings)
            })
          })
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          refreshing: false,
          error: true
        })
      })
  }

  //attempt to fetch from asyncstorage
  componentWillMount() {
    AsyncStorage.getItem('driversStandings')
      .then((value) => {
        if (!value) {
          this.getDrivers()
          return
        }
        const drivers = JSON.parse(value)

        if (moment().unix() > drivers.expireTime) {
          this.getDrivers()
        } else {
          this.setState({
            isLoading: false,
            drivers: ds.cloneWithRows(drivers.standings)
          })
        }
      })
      .catch(() => {
        this.getDrivers()
      })
  }

  //if we are still waiting for the api or storage display a loading symbol
  //if this fails manually render all assets
  render() {
    const { routeName } = this.props.navigation.state
    const { isLoading, drivers, error } = this.state

    if (isLoading) {
      return (
        <View style={ styles.container }>
          <StatsHeader name={ routeName } />
          <ActivityIndicator
            animating={ isLoading }
            style={[ styles.centering, {height: 80} ]}
            size="large" />
        </View>
      )
    } else if (!isLoading && drivers.length === 0 && error) {
      return (
        <ErrorPage />
      )
    } else {
      return (
        <View style={ styles.container }>
          <StatsHeader name={ routeName } />
          { drivers && drivers._cachedRowCount > 0 && error ?
            <View style={ styles.errMsg }>
            <ScalableText style={ styles.errMsgTxt }>Unable to load new data!</ScalableText></View> :
            <View></View>
          }
          <ListView
            style={ styles.drivers }
            refreshControl={ this.refreshControl() }
            dataSource={ drivers }
            renderRow={ this.renderRow } />
        </View>
      )
    }
  }
  

  refreshControl() {
    return (
      <RefreshControl
        refreshing={ this.state.refreshing }
        onRefresh={ () => this.refreshListView() } />
    )
  }

  refreshListView() {
    this.setState({ refreshing: true })
    this.getDrivers()
  }

  renderRow() {
    return (
      <View>
        <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>2</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/pic.png")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
            Sebastian Vettel
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Ferrari</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          2
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>320</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>3</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/kim.jpg")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
            Kimi Raikkonen
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Ferrari</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          1
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>251</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>1</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/lew.jpg")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
            Lewis Hamilton
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Mercedes</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          11
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>408</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>4</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/val.jpg")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
          Valterri Bottas
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Mercedes</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          0
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>247</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>5</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/max.jpg")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
           Max Verstappen
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Red Bull</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          2
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>249</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>9</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/kev.jpg")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
            Kevin Magnussen
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Haas</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          0
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>56</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>14</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/rom.jpg")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
            Romain Grosjean
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Haas</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          0
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>37</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>8</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/serg.jpg")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
            Sergio Perez
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Force India</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          0
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>62</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      <View style={ styles.driver }>
        <ScalableText style={ styles.avatarTxt }>12</ScalableText>
        <View style={ styles.avatarBox }>
          <Image style={ styles.avatar }
                 source={require("../assets/est.jpg")}/>
        </View>
        <View style={ styles.info }>
          <ScalableText style={ styles.name }>
            Esteban Ocon
          </ScalableText>
          <ScalableText style={ styles.teamConstructor }>Force India</ScalableText>
        </View>
        <View style={ styles.winsBox }>
          <ScalableText style={ styles.wins }>
          0
          </ScalableText>
        </View>
        <View style={ styles.pointsBox }>
          <ScalableText style={ styles.points }>37</ScalableText>
          <Image style={ styles.flag }
                 source={require("../assets/ger.png")}/>
        </View>
      </View>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  errMsg: {
    flexDirection: 'row',
    backgroundColor: '#f94057',
    alignItems: 'center',
    justifyContent: 'center',
    height: 16
  },
  errMsgTxt: {
    fontSize: 10,
    fontFamily: 'Raleway-Medium',
    color: '#fff'
  },
  drivers: {
    flex: 1
  },
  driver: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6'
  },
  avatarBox: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 10,
    position: 'relative',
    zIndex: 10,
    top: 3
  },
  avatar: {
    position: 'relative',
    top: 0,
    right: 0,
    zIndex: 2,
    width: 35,
    height: 35
  },
  avatarTxt: {
    position: 'relative',
    // top: 0,
    // left: 0,
    // zIndex: -1,
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    color: '#f94057',
    lineHeight: Platform.OS === 'ios' ? 40 : 30,
    width: 25,
    height: 40
  },
  info: {
    flex: 1
  },
  number: {
    color: '#f94057'
  },
  name: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#444'
  },
  teamConstructor: {
    fontFamily: 'Raleway-Medium',
    fontSize: 12,
    lineHeight: 12,
    color: '#819cad',
    paddingTop: 5
  },
  winsBox: {
    width: 45,
    height: 40
  },
  wins: {
    width: 45,
    height: 40,
    textAlign: 'center',
    fontFamily: 'Raleway-Medium',
    fontSize: 16
  },
  pointsBox: {
    width: 50,
    height: 40,
    alignItems: 'flex-end'
  },
  points: {
    color: '#f94057',
    fontFamily: 'Raleway-SemiBold',
    textAlign: 'right',
    fontSize: 16,
    lineHeight: 16
  },
  flag: {
    height: 11,
    width: 16,
    marginTop: 8,
    alignItems: 'flex-end'
  }
})

DriversScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}

module.exports = DriversScreen
