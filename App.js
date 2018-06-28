import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Picker,
  Button
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  //Initialize a state/var for Brix to do calculations on
  constructor(props) {
    super(props);
    this.state = {value: 10.0};
  }

  //This is going to be where it calculates the Brix to SG
  //and saves the value into the state/var
  doMath = () => {
    this.setState((prevState) => ({
      value: (prevState.value / (258.6 - ((prevState.value / 258.2) * 227.1))) + 1
    }));
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Brix to Specific Gravity
        </Text>

        {/*Change between unfermented wort/must and fermenting*/}
        <Picker
          selectedValue={this.state.wort}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => this.setState({ wort: itemValue })}>
          <Picker.Item label="Unfermented" value="unfermented" />
          <Picker.Item label="Fermenting" value="fermenting" />
        </Picker>

        <Text style={styles.brix}>
          Brix:
        </Text>

        {/*Change onChangeText (possibly onChange, onEndEditing or onSubmitEditing) to call
         a function that does some math on the Brix value*/}
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          autoFocus={true}
          placeholder="10.0"
          keyboardType="numeric"
          maxLength={5}
          onChangeText={(value) => { this.setState({value}); this.doMath(); } }
        />

        {/*Show the calculated value*/}
        <Text style={styles.calculated}>
          Specific Gravity: {this.state.value.toFixed(3)}
        </Text>
		
        <Text style={styles.footer}>
          Who is Baldr?{'\n'}
          In Norse mythology Baldr is the God of Light{'\n'}
          "insert URL here"
        </Text>
		
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e4f9db',
  },
  title: {
    color: 'black',
    fontSize: 32,
	  fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
  },
  picker: {
	  color: 'black',
	  height: 50,
    width: 200,
  },
  brix: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    margin: 10,
	  color: 'black',
	  width: 100,
    fontSize: 25,
    borderRadius: 4,
    borderColor: '#ccc',
	  borderWidth: 1,
    textAlign: 'center',
  },
  calculated: {
    color: 'green',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 10,
  },
  footer: {
    textAlign: 'center',
    margin: 5,
  }
});
