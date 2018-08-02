import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Picker,
  Linking
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press CTRL-M for dev menu',
});

export default class App extends Component {
  //Initialize a state for Brix to do calculations on
  constructor(props) {
    super(props);
    //Set initial value to the calculated SG of the TextInput placeholder
    //because doMath has not been called, yet
    this.state = {value: 1.040};
  }

  //Calculate Brix to SG and save the value into the state
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
          <Picker.Item label="Unfermented Wort/Must" value="unfermented" />
          <Picker.Item label="Fermenting Wort/Must" value="fermenting" />
        </Picker>

          <View style={styles.row}>
            <Text style={styles.large}>
              Brix:
            </Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoFocus={true}
              placeholder="10.0"
              keyboardType="numeric"
              maxLength={5}
              onChangeText={(value) => { this.setState({ value }); this.doMath(); }}
            />
          </View>

        <View style={styles.row}>
          <Text style={styles.large}>
            Specific Gravity:
          </Text>
          {/*Show the calculated value and rounds to 3 decimal places*/}
          <Text style={styles.calculated}>
            {this.state.value.toFixed(3)}
          </Text>
        </View>
		
        <Text style={styles.footer}>
          <Text style={{ fontWeight: 'bold' }}>Equation:</Text> SG = (Brix / (258.6-((Brix / 258.2)*227.1))) + 1{'\n'}
          <Text style={styles.url} onPress={() => Linking.openURL('https://www.brewersfriend.com/brix-converter/')}>More Info</Text>{'\n'}{'\n'}
          <Text style={{ fontWeight: 'bold' }}>Who is Baldr?</Text>{'\n'}
          In Norse mythology Baldr is the God of Light{'\n'}
          <Text style={styles.url} onPress={() => Linking.openURL('http://mythology.wikia.com/wiki/Baldr')}>
            http://mythology.wikia.com/wiki/Baldr
          </Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    //fontFamily: "RunyTunesRevisitedNF",
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  picker: {
    color: 'black',
    height: 50,
    width: 225,
  },
  large: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    margin: 10,
    color: 'black',
    width: 85,
    fontSize: 25,
    borderRadius: 4,
    borderWidth: 2,
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
  url: {
    textDecorationLine: 'underline',
  },
  footer: {
    color: 'black',
    textAlign: 'left',
    margin: 1,
  }
});
