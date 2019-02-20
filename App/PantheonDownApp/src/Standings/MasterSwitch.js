import React, {Component} from 'react'
import {Text} from 'react-native'
import firebase from 'firebase'

class Reading3 extends Component { 
  constructor(props) {
    super(props)

    this.state = {
      text: 'On'
    }
    
    this._handleSwitch = this._handleSwitch.bind(this)
  }
  //when the component is tapped by the user this method is trigerred 
  //this publishes the value to firebase and sets the state of text 
  //set state is used to rerender on touch
  _handleSwitch() {
    if (this.state.downforce=='On') {
      firebase.database().ref('Reading/').set({
        Value: 0
      })
      this.setState({
        text: 'Off'
        
      }) 
    }
    else {
      firebase.database().ref('Reading/').set({
        Value: 1
      })
      this.setState({
        text: 'On'
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
  