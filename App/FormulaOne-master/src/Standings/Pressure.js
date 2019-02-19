import React, {Component} from 'react'
import firebase from 'firebase'
import ScalableText from 'react-native-text'

class Reading1 extends Component { 
  constructor(props) {
    super(props)

    this.state = {
      downforce: 'loading'
    }
      
  }
  componentDidMount() {
    firebase.database().ref('/Pressure/Value').on('value', snapshot => {
      this.setState({downforce: snapshot.val()})
      console.log(this.state.downforce)
    })
  }

  render() {
    return (
        <ScalableText style={styles.textStyle}>
        {this.state.downforce}
        </ScalableText>
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

export default Reading1
  