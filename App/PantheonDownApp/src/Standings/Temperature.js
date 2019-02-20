import React, {Component} from 'react'
import firebase from 'firebase'
import ScalableText from 'react-native-text'

class Reading2 extends Component { 
  constructor(props) {
    super(props)

    this.state = {
      downforce: 'loading'
    }
      
  }
    //fetch data from firebase on component mount 
  //ensures that temperature value is fetched before component is rendered 
  //.on is used to ensure that we are listening for any changes
  //this.setstate is used to rerender the component on statechange
  componentDidMount() {
    firebase.database().ref('/Temperature/Value').on('value', snapshot => {
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

export default Reading2
  