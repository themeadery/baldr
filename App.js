import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Linking,
} from 'react-native';
//Import modules for navigation
import { useScreens } from 'react-native-screens';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
//Import Material Design Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Activate the react-native-screens module
useScreens();

//Dev instructions footer
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press CTRL-M for dev menu',
});

class UnfermentedScreen extends React.Component {
  
  //Initialize a state for Brix to do calculations on
  constructor(props) {
    super(props);
    //Set initial value to the calculated SG of the TextInput placeholder
    //because doMath has not been called, yet
    this.state = {
      originalBrix: 10.0,
      OG: 1.038
    };
  }

  //Calculate Brix to SG and save the value into the state
  doMathOG = () => {
    this.setState((prevState) => ({
      OG: ((prevState.originalBrix / 1.04) / (258.6 - (((prevState.originalBrix / 1.04) / 258.2) * 227.1))) + 1
    }));
  }

  render() {
    return (
      <View style={styles.container}>
            
            <View style={styles.body}>
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
                    onChangeText={(originalBrix) => { this.setState({ originalBrix }); this.doMathOG(); }}
                  />
                </View>

              <View style={styles.row}>
                <Text style={styles.large}>
                  Specific Gravity:
                </Text>
                {/*Show the calculated value and rounds to 3 decimal places*/}
                <Text style={styles.calculated}>
                  {this.state.OG.toFixed(3)}
                </Text>
              </View>
            </View>
        
            <View style={styles.footerView}>  
              <Text style={styles.footerText}>
                <Text style={{ fontWeight: 'bold' }}>Equation:</Text>{'\n'}
                  SG = ((Brix / 1.04) / (258.6-(((Brix / 1.04) / 258.2)*227.1))) + 1 
                <Text onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}><MaterialIcons name="info" size={20} color="grey" /></Text>{'\n'}
                  Note: A Wort Correction Factor (WCF) of 1.040 has been applied{'\n'}{'\n'}
                <Text style={{ fontWeight: 'bold' }}>Who is Baldr?</Text>{'\n'}
                In Norse mythology Baldr is the God of Light{'\n'}
                <Text style={styles.url} onPress={() => Linking.openURL('http://mythology.wikia.com/wiki/Baldr')}>http://mythology.wikia.com/wiki/Baldr</Text>
              </Text>
        
              <Text style={styles.instructions}>
                {instructions}
              </Text>
            </View>

      </View>
    );
  }
}

class FermentingScreen extends React.Component {
  
  //Initialize a state for Brix to do calculations on
  constructor(props) {
    super(props);
    //Set initial value to the calculated SG of the TextInput placeholder
    //because doMath has not been called, yet
    this.state = {
      originalBrix: 10.0,
      OG: 1.038,
      currentBrix: 5.0,
      FG: 1.0086,
      ABV: 3.6,
      AA: 73.3
    };
  }

  //Calculate Brix to SG and save the value into the state
  doMathOG = () => {
    this.setState((prevState) => ({
      OG: ((prevState.originalBrix / 1.04) / (258.6 - (((prevState.originalBrix / 1.04) / 258.2) * 227.1))) + 1
    }));
  }

  doMathFG = () => {
    this.setState((prevState) => ({
      //FG: (prevState.FG / (258.6 - ((prevState.FG / 258.2) * 227.1))) + 1
      FG: (1 - 0.000856829 * (prevState.originalBrix / 1.04) + 0.00349412 * (prevState.currentBrix / 1.04))
    }));
  }

  doMathABV = () => {
    this.setState((prevState) => ({
      ABV: ((prevState.OG - prevState.FG) * 131.25)
    }));
  }

  doMathAA = () => {
    this.setState((prevState) => ({
      AA: (100 * (prevState.OG - prevState.FG) / (prevState.OG - 1.0))
    }));
  }

  render() {
    return (
      <View style={styles.container}>    
            <View style={styles.body}>
                <View style={styles.row}>
                  <Text style={styles.large}>
                    Original Brix:
                  </Text>
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    autoFocus={true}
                    placeholder="10.0"
                    keyboardType="numeric"
                    maxLength={5}
                    onChangeText={(originalBrix) => { this.setState({ originalBrix }); this.doMathOG(); this.doMathABV(); this.doMathAA(); }}
                  />
                 <Text style={styles.large}>
                  OG:
                </Text>
                {/*Show the calculated value and rounds to 3 decimal places*/}
                <Text style={styles.calculated}>
                  {this.state.OG.toFixed(3)}
                </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.large}>
                    Current Brix:
                  </Text>
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="5.0"
                    keyboardType="numeric"
                    maxLength={5}
                    onChangeText={(currentBrix) => { this.setState({ currentBrix }); this.doMathFG(); this.doMathABV(); this.doMathAA(); }}
                  />
                  <Text style={styles.large}>
                  FG:
                </Text>
                {/*Show the calculated value and rounds to 3 decimal places*/}
                <Text style={styles.calculated}>
                  {this.state.FG.toFixed(3)}
                </Text>
                </View>
              <View style={styles.row}>
                <Text style={styles.large}>
                  ABV:
                </Text>
                {/*Show the calculated value and rounds to 1 decimal place*/}
                <Text style={styles.calculated}>
                  {this.state.ABV.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.row}>
                  <Text style={styles.smallText}>Apparent Attenuation:</Text>
                {/*Show the calculated value and rounds to 1 decimal place*/}
                <Text style={styles.calculatedSmall}>
                  {this.state.AA.toFixed(1)}%
                </Text>
              </View>
            </View>
        
            <View style={styles.footerView}>  
              <Text style={styles.footerText}>
                <Text style={{ fontWeight: 'bold' }}>Equations:</Text>{'\n'}
                  OG = ((Starting Brix / 1.04) / (258.6-(((Starting Brix / 1.04) / 258.2)*227.1))) + 1 
                <Text onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}><MaterialIcons name="info" size={20} color="grey" /></Text>{'\n'}
                  Note: A Wort Correction Factor (WCF) of 1.040 has been applied{'\n'}
                  FG = 1 - 0.000856829 * (Starting Brix / 1.04) + 0.00349412 * (Current Brix / 1.04)
                  ABV = (OG - FG) * 131.25{'\n'}
                  AA = 100 * (OG – FG)/(OG – 1.0){'\n'}{'\n'}
                <Text style={{ fontWeight: 'bold' }}>Who is Baldr?</Text>{'\n'}
                In Norse mythology Baldr is the God of Light{'\n'}
                <Text style={styles.url} onPress={() => Linking.openURL('http://mythology.wikia.com/wiki/Baldr')}>http://mythology.wikia.com/wiki/Baldr</Text>
              </Text>
        
              <Text style={styles.instructions}>
                {instructions}
              </Text>
            </View>

      </View>
    );
  }
}

const TabNavigator = createMaterialTopTabNavigator({
  UNFERMENTED: UnfermentedScreen,
  FERMENTING: FermentingScreen,
},
{
  tabBarOptions: {
    activeTintColor: 'black',
    inactiveTintColor: 'grey',
    style: {
      backgroundColor: '#fff9c4',
    },
    labelStyle: {
      fontWeight: 'bold',
    },
  },
});

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F6',
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1E2E1',
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  calculatedSmall: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  smallText: {
    color: 'black',
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 10,
  },
  url: {
    textDecorationLine: 'underline',
  },
  footerView: {
    backgroundColor: '#F5F5F6',
    padding: 15,
  },
  footerText: {
    color: 'black',
    textAlign: 'left',
    fontSize: 12,
  }
});
