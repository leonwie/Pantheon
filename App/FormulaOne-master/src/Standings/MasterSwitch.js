import React, {Component} from 'react'
import {Text} from 'react-native'
import firebase from 'firebase'

class Reading3 extends Component { 
  constructor(props) {
    super(props)

    this.state = {
      downforce: 'On'
    }
    
    this._handleSwitch = this._handleSwitch.bind(this)
  }

  _handleSwitch() {
    if (this.state.downforce=='On') {
      firebase.database().ref('Reading/').set({
        Value: 0
      })
      this.setState({
        downforce: 'Off'
        
      }) 
    }
    else {
      firebase.database().ref('Reading/').set({
        Value: 1
      })
      this.setState({
        downforce: 'On'
      }) 
    }
  }

  render() {
    return (
        <Text style={styles.textStyle}
        onPress={this._handleSwitch}>
        {this.state.downforce}
        </Text>
    )
  }
}

const styles = {
  textStyle: { 
    color: '#f94057',
    fontFamily: 'Raleway-SemiBold',
    textAlign: 'right',
    fontSize: 20
  }
}

export default Reading3
  