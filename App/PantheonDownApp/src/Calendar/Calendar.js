/* @flow */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  View,
  StyleSheet,
  ListView,
  Image,
  StatusBar,
  AsyncStorage,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TouchableOpacity
} from 'react-native'

import ScalableText from 'react-native-text'
import moment from 'moment-timezone'

import api from '../Utils/api'
import ErrorPage from '../Components/ErrorPage'
import HomeHeader from '../Components/HomeHeader'

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
})

class CalendarScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      error: false,
      calendar: [],
      refreshing: false
    }

    // Bind internal functions, necessary in ES6 + React
    this.renderRow = this.renderRow.bind(this)
  }

  getCurrentCalendar() {
    api.getCurrentCalendar(moment().format('YYYY'))
      .then((races) => {
        const calendar = {
          raceTable: races,
          expireTime: moment().add(1, 'd').unix()
        }

        AsyncStorage.setItem('calendar', JSON.stringify(calendar))
          .then(() => {
            this.setState({
              isLoading: false,
              refreshing: false,
              error: false,
              calendar: ds.cloneWithRows(calendar.raceTable)
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

  componentWillMount() {
    AsyncStorage.getItem('calendar')
      .then((value) => {
        if (!value) {
          this.getCurrentCalendar()

          return
        }

        const calendar = JSON.parse(value)

        if (moment().unix() > calendar.expireTime) {
          this.getCurrentCalendar()
        } else {
          this.setState({
            isLoading: false,
            calendar: ds.cloneWithRows(calendar.raceTable)
          })
        }
      })
      .catch(() => {
        this.getCurrentCalendar()
      })
  }

  render() {
    const { isLoading, calendar, error } = this.state

    const CalendarContent = () => {
      if (isLoading) {
        return (
          <ActivityIndicator
            animating={ isLoading }
            style={[ styles.centering, {height: 80} ]}
            size="large" />
        )
      } else if (!isLoading && calendar.length === 0 && error) {
        return ( <ErrorPage /> )
      } else {
        return (
          <View style={ styles.container }>
            { calendar && calendar._cachedRowCount > 0 && error ?
              <View style={ styles.errMsg }><ScalableText style={ styles.errMsgTxt }>Unable to load new data!</ScalableText></View> :
              <View></View>
            }
            <ListView
              style={ styles.calendar }
              refreshControl={ this._refreshControl() }
              dataSource={ calendar }
              renderRow={ this.renderRow } />
          </View>
        )
      }
    }

    return (
      <View style={ styles.container }>
        <StatusBar
          barStyle="light-content"
          backgroundColor={'#202930'} />
        <HomeHeader
          title="F1 Info"
          navigation={ this.props.navigation } />
        <CalendarContent />
      </View>
    )
  }

  renderRow(rowData, sectionID, rowID) {
    const content = (
      <View>
        <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Mar 17</ScalableText>
          <ScalableText style={ styles.dateText }>12:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }>Melbourne</ScalableText>
            <ScalableText style={ styles.raceLocation }>Australia</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Mar 31</ScalableText>
          <ScalableText style={ styles.dateText }>11:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Bahrain</ScalableText>
            <ScalableText style={ styles.raceLocation }>Sakhir</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Apr 14</ScalableText>
          <ScalableText style={ styles.dateText }>11:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }>Shanghai </ScalableText>
            <ScalableText style={ styles.raceLocation }>China</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Apr 28</ScalableText>
          <ScalableText style={ styles.dateText }>13:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Baku</ScalableText>
            <ScalableText style={ styles.raceLocation }>Azerbaijan</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>May 12 </ScalableText>
          <ScalableText style={ styles.dateText }>12:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Barcelona</ScalableText>
            <ScalableText style={ styles.raceLocation }>Spain</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>May 26</ScalableText>
          <ScalableText style={ styles.dateText }>11:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Monaco</ScalableText>
            <ScalableText style={ styles.raceLocation }>Monaco</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Jun 9</ScalableText>
          <ScalableText style={ styles.dateText }>11:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Montreal</ScalableText>
            <ScalableText style={ styles.raceLocation }>Canada</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Jun 23</ScalableText>
          <ScalableText style={ styles.dateText }>12:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Le Castellet</ScalableText>
            <ScalableText style={ styles.raceLocation }>France</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Jun 30</ScalableText>
          <ScalableText style={ styles.dateText }>11:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Spielberg</ScalableText>
            <ScalableText style={ styles.raceLocation }>Austria</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Jun 14</ScalableText>
          <ScalableText style={ styles.dateText }>14:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Silverstone</ScalableText>
            <ScalableText style={ styles.raceLocation }>Great Britain</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Jul 28</ScalableText>
          <ScalableText style={ styles.dateText }>15:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Hockenheim</ScalableText>
            <ScalableText style={ styles.raceLocation }>Germany</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Aug 4</ScalableText>
          <ScalableText style={ styles.dateText }>14:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Budapest</ScalableText>
            <ScalableText style={ styles.raceLocation }>Hungary</ScalableText>
          </View>
        </View>
      </View>
      <View
        style={ styles.row }
        onPress={ () => this.props.navigation.navigate('CircuitScreen') }>
        <View style={ styles.dateContainer }>
          <ScalableText style={ styles.dateText }>Sep 1</ScalableText>
          <ScalableText style={ styles.dateText }>11:00</ScalableText>
        </View>
        <View style={ styles.details }>
          <View style={ styles.circle }></View>
          <View style={ styles.raceContent }>
            <ScalableText style={ styles.raceName }> Spa</ScalableText>
            <ScalableText style={ styles.raceLocation }>Belgium</ScalableText>
          </View>
        </View>
      </View>
      
      </View>
    )

    if ((this.state.calendar._cachedRowCount - 1) == rowID) {
      return (
        <View>
          <Image
            style={ styles.footerImg }
            source={ require('../../assets/images/calendar-footer.jpg') }>
            <View style={ styles.footerContent }>
              { content }
            </View>
          </Image>
        </View>
      )
    }

    return (
      <View>
        { content }
      </View>
    )
  }

  _refreshControl() {
    return (
      <RefreshControl
        refreshing={ this.state.refreshing }
        onRefresh={ () => this.refreshListView() } />
    )
  }

  refreshListView() {
    //Start Rendering Spinner
    this.setState({ refreshing: true })
    this.getCurrentCalendar()
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  calendar: {
    flex: 1
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
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 50
  },
  dateContainer: {
    width: 60
  },
  dateText: {
    fontFamily: 'Raleway-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: '#f94057',
    textAlign: 'right'
  },
  details: {
    borderColor: '#f94057',
    borderLeftWidth: 1,
    flexDirection: 'column',
    flex: 1,
    marginLeft: 20,
    paddingLeft: 20
  },
  circle: {
    opacity: Platform.OS === 'ios' ? 1 : 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#f94057',
    backgroundColor: '#fff',
    position: 'absolute',
    left: -6,
    top: 14
  },
  raceContent: {
    flex: 1,
    justifyContent: 'center'
  },
  raceName: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#444'
  },
  raceLocation: {
    fontFamily: 'Raleway-Medium',
    fontSize: 12,
    lineHeight: 12,
    paddingBottom: 3,
    color: '#819cad'
  },
  footerContent: {
    flexDirection: 'row',
    position: 'relative',
    top: 0,
    flex: 1,
    left: 0
  },
  footerImg: {
    flex: 1,
    width: undefined,
    height: 300,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

CalendarScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}

module.exports = CalendarScreen
