import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Linking,
  TouchableOpacity,
} from 'react-native';
//Import modules for navigation
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation';
//Import Material Design Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class UnfermentedScreen extends React.Component {

  //Set autofocus for input using the ref in TextInput
  //change to subscribe to navigation lifecycle https://reactnavigation.org/docs/en/navigation-prop.html#addlistener-subscribe-to-updates-to-navigation-lifecycle
  componentDidMount() {
     this.brixInput.focus();
  }

  //Need componentWillUnmount cleanup
  
  //Initialize states to do Math on
  constructor(props) {
    super(props);
    this.state = {
      originalBrix: 0.0,
      OG: 0.000
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

          <View style={styles.unfermentedBodyLeft}>
            <Text style={styles.large}>Brix:</Text>
            <Text style={styles.large}>Specific Gravity:</Text>
          </View>

          <View style={styles.unfermentedBodyRight}>
            <TextInput
                style={styles.input}
                ref={(input) => { this.brixInput = input; }}
                underlineColorAndroid="transparent"
                placeholder="0.0"
                keyboardType="numeric"
                maxLength={5}
                onChangeText={(originalBrix) => { this.setState({ originalBrix }); this.doMathOG(); }}
            />
            
            {/*Show the calculated value and rounds to 3 decimal places*/}
            <Text style={styles.calculated}>
              {this.state.OG.toFixed(3)}
            </Text>
          </View>

        </View>
    
        <View style={styles.footerView}>

          <View style={styles.footerViewLeft}>
            <Text style={styles.footerText}>
              <Text style={styles.footerTextBoldH1}>Equation:</Text>
              {'\n'}SG = ((Brix / WCF) / (258.6-(((Brix / WCF) / 258.2)*227.1))) + 1
              {'\n'}{'\n'}<Text style={styles.footerTextBoldH2}>Note: </Text>A Wort Correction Factor (WCF) of 1.040 has been applied
              {'\n'}This means that this calculator is specifically tuned for beer, not wine, mead or other fermentables

              {'\n'}{'\n'}<Text style={styles.footerTextBoldH1}>Who is Baldr?</Text>
              {'\n'}In Norse mythology Baldr is the God of Light
              {'\n'}<Text style={styles.url} onPress={() => Linking.openURL('http://mythology.wikia.com/wiki/Baldr')}>http://mythology.wikia.com/wiki/Baldr</Text>
            </Text>
          </View>

          <View style={styles.footerViewRight}>
            <View style={{paddingTop: 18}}>
              <TouchableOpacity onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}>
                <MaterialIcons name="info" size={24}/>
              </TouchableOpacity>
            </View>
            <View style={{paddingTop: 24}}>
              <TouchableOpacity onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}>
                <MaterialIcons name="info" size={24}/>
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </View>
    );
  }
}

class FermentingScreen extends React.Component {

  //Set autofocus for input using the ref in TextInput
  //componentDidMount() {
  //  setTimeout(() => {
  //    this.originalBrixInput.focus();
  //  }, 200);
  //}
  
  //Initialize states to do Math on
  constructor(props) {
    super(props);
    this.state = {
      originalBrix: 0.0,
      OG: 0.000,
      OE: 0.00,
      currentBrix: 0.0,
      FG: 0.000,
      AE: 0.00,
      RE: 0.00,
      ABW: 0.0,
      ABV: 0.0,
      AA: 0.0
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
      FG: (1 - 0.000856829 * (prevState.originalBrix / 1.04) + 0.00349412 * (prevState.currentBrix / 1.04))
    }));
  }

  doMathOE = () => {
    this.setState((prevState) => ({
      OE: (-668.962 + 1262.45 * prevState.OG - 776.43 * (prevState.OG * prevState.OG) + 182.94 * (prevState.OG * prevState.OG * prevState.OG))
    }));
  }
  
  doMathAE = () => {
    this.setState((prevState) => ({
      AE: (-668.962 + 1262.45 * prevState.FG - 776.43 * (prevState.FG * prevState.FG) + 182.94 * (prevState.FG * prevState.FG * prevState.FG))
    }));
  }

  //this may not be accurate, check Math in Mash SummerZym95.pdf q variable
  doMathRE = () => {
    this.setState((prevState) => ({
      RE: (0.8114 * prevState.AE + 0.1886 * prevState.OE)
    }));
  }

  doMathABW = () => {
    this.setState((prevState) => ({
      ABW: ((prevState.OE - prevState.RE) / (2.0665 - 0.010665 * prevState.OE))
    }));
  }

  doMathABV = () => {
    this.setState((prevState) => ({
      //ABV: ((prevState.OG - prevState.FG) * 131.25)
      //ABV: ((0.01 / 0.8192) * ((prevState.originalBrix / 1.04) - (0.1808 * (prevState.originalBrix / 1.04) + 0.8192 * (668.72 * prevState.FG - 463.37 - 205.347 * (prevState.FG * prevState.FG)))) / (2.0665 - 0.010665 * (prevState.originalBrix / 1.04)))
      ABV: (prevState.ABW * (prevState.FG / 0.794))
    }));
  }

  doMathAA = () => {
    this.setState((prevState) => ({
      AA: (100 * (prevState.OG - prevState.FG) / (prevState.OG - 1.0))
    }));
  }

  //Call the rest of the Math functions after getting the OG or FG values
  //without having to list them all in onChangeText
  doRemainingMath() {
    this.doMathOE();
    this.doMathAE();
    this.doMathRE();
    this.doMathABW();
    this.doMathABV();
    this.doMathAA();
  }

  render() {
    return (
      <View style={styles.container}>
  
        <View style={styles.body}>
          
          <View style={styles.fermentingBodyLeft}>
            <Text style={styles.large}>
              Original Brix:
            </Text>
            <Text style={styles.large}>
              OG:
            </Text>
            <Text style={styles.large}>
              Current Brix:
            </Text>
            <Text style={styles.large}>
              FG:
            </Text>
            <Text style={styles.large}>
              ABV:
            </Text>
            <Text style={styles.smallText}>
              Apparent Attenuation:
            </Text>
            <Text style={styles.smallText}>
              Original Extract:
            </Text>
            <Text style={styles.smallText}>
              Apparent Extract:
            </Text>
            <Text style={styles.smallText}>
              Real Extract:
            </Text>
            <Text style={styles.smallText}>
              ABW:
            </Text>
          </View>

          <View style={styles.fermentingBodyRight}>
            <TextInput
                style={styles.input}
                ref={(input) => { this.originalBrixInput = input; }}
                underlineColorAndroid="transparent"
                placeholder="0.0"
                keyboardType="numeric"
                maxLength={5}
                onChangeText={(originalBrix) => { this.setState({ originalBrix }); this.doMathOG(); this.doRemainingMath(); }}
            />
            {/*Show the calculated value and rounds to 3 decimal places*/}
            <Text style={styles.calculated}>
              {this.state.OG.toFixed(3)}
            </Text>
            <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="0.0"
                keyboardType="numeric"
                maxLength={5}
                onChangeText={(currentBrix) => { this.setState({ currentBrix }); this.doMathFG(); this.doRemainingMath(); }}
              />
            <Text style={styles.calculated}>
              {this.state.FG.toFixed(3)}
            </Text>
            <Text style={styles.calculated}>
              {this.state.ABV.toFixed(1)}%
            </Text>
            <Text style={styles.calculatedSmall}>
              {this.state.AA.toFixed(1)}%
            </Text>
            <Text style={styles.calculatedSmall}>
              {this.state.OE.toFixed(2)} °P
            </Text>
            <Text style={styles.calculatedSmall}>
              {this.state.AE.toFixed(2)} °P
            </Text>
            <Text style={styles.calculatedSmall}>
              {this.state.RE.toFixed(2)} °P
            </Text>
            <Text style={styles.calculatedSmall}>
              {this.state.ABW.toFixed(1)}%
            </Text>
          </View>

        </View>
    
        <View style={styles.footerView}>

          <View style={styles.footerViewLeft}>
            <Text style={styles.footerText}>
              <Text style={styles.footerTextBoldH1}>Equations:</Text>
              {'\n'}OG = ((OB / WCF) / (258.6-(((OB / WCF) / 258.2)*227.1))) + 1
              {'\n'}FG = 1 - 0.000856829 * (OB / WCF) + 0.00349412 * (CB / WCF)
              {'\n'}ABV = ABW * (FG/0.794)
              {'\n'}AA = 100 * (OG – FG)/(OG – 1.0)
              {'\n'}OE
              {'\n'}AE
              {'\n'}RE
              {'\n'}ABW            

              {'\n'}{'\n'}<Text style={styles.footerTextBoldH2}>Note: </Text>A Wort Correction Factor (WCF) of 1.040 has been applied
              {'\n'}This means that this calculator is specifically tuned for beer, not wine, mead or other fermentables
                
              {'\n'}{'\n'}<Text style={styles.footerTextBoldH1}>Who is Baldr?</Text>
              {'\n'}In Norse mythology Baldr is the God of Light
              {'\n'}<Text style={styles.url} onPress={() => Linking.openURL('http://mythology.wikia.com/wiki/Baldr')}>http://mythology.wikia.com/wiki/Baldr</Text>
            </Text>
          </View>

          <View style={styles.footerViewRight}>
            <View style={{paddingTop: 65}}>
              <TouchableOpacity onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}>
                <MaterialIcons name="info" size={24}/>
              </TouchableOpacity>
            </View>
            <View style={{paddingTop: 85}}>
              <TouchableOpacity onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}>
                <MaterialIcons name="info" size={24}/>
              </TouchableOpacity>
            </View>
          </View>

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
      paddingTop: 12,
    },
    indicatorStyle: {
      backgroundColor: 'black',
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
    backgroundColor: 'green',
    //backgroundColor: '#E1E2E1',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    elevation: 2
  },
  unfermentedBodyLeft: {
    backgroundColor: 'lightblue',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 10
  },
  unfermentedBodyRight: {
    backgroundColor: 'skyblue'
  },
  fermentingBodyLeft: {
    backgroundColor: 'lightblue',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 10
  },
  fermentingBodyRight: {
    backgroundColor: 'skyblue',
    justifyContent: 'space-between'
  },
  large: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  input: {
    color: 'black',
    height: 50,
    width: 80,
    fontSize: 24,
    borderRadius: 4,
    borderWidth: 2,
    textAlign: 'center',
  },
  calculated: {
    color: 'green',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    //paddingTop: 12
  },
  calculatedSmall: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
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
    fontSize: 12,
  },
  footerView: {
    backgroundColor: '#F5F5F6',
    //backgroundColor: 'green',
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  footerViewLeft: {
    //backgroundColor: 'yellow',
    width: 375,
  },
  footerViewRight: {
    //backgroundColor: 'white',
    paddingLeft: 2
  },
  footerText: {
    color: 'black',
    textAlign: 'left',
    fontSize: 13,
  },
  footerTextBoldH1: {
    color: 'black',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerTextBoldH2: {
    color: 'black',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
});
