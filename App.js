import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Linking,
  TouchableOpacity,
  Image,
  StatusBar,
  //Platform
} from 'react-native';
//Import modules for navigation
import {
  createAppContainer,
  createStackNavigator,
  NavigationEvents,
  //SafeAreaView
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
//Import Material Design Icons
import Icon from 'react-native-vector-icons/MaterialIcons';

const infoIcon = (<Icon name="info-outline" size={24} />)

let version = 'v0.2.0';

class UnfermentedScreen extends React.Component {
  
  constructor(props) {
    super(props);
    //Create the ability to set a ref in TextInput
    this.textInput = React.createRef();
    //I don't know what this does
    this.focusTextInput = this.focusTextInput.bind(this);
    //Initialize states to do Math on
    this.state = {
      originalBrix: 0.0,
      OG: 1.000
    };
  }

  //Focus text input function, needs Timeout delay for Tab Navigator quirks
  focusTextInput() {
    setTimeout(
      this.textInput.focus,
      100
    );
  }

  //Calculate Brix to SG and save the value into the state
  doMathOG = () => {
    this.setState((prevState) => ({
      OG: ((prevState.originalBrix / 1.04) / (258.6 - (((prevState.originalBrix / 1.04) / 258.2) * 227.1))) + 1
    }));
  }

  render() {
    return (
      //Wrap everything above the Tab Navigator in a ScrollView
      <ScrollView style={styles.scrollViewContainer}>
      {/*Change the Status Bar on Android to a custom color*/}
      <StatusBar
          barStyle="dark-content"
          backgroundColor="#cbc693"
      />
      {/*Subscribe to Navigation Event onDidFocus, change focus to the Brix Input using the ref when this tab is focused*/}
      <NavigationEvents
        onDidFocus={this.focusTextInput}
      />
        <View style={styles.body}>
          <View style={styles.dataTableContainer}>
            <View style={styles.unfermentedBodyLeft}>
              <Text style={styles.large}>Brix</Text>
              <Text style={styles.large}>Specific Gravity</Text>
            </View>
            <View style={styles.unfermentedBodyRight}>
              <TextInput
                  style={styles.input}
                  ref={input => this.textInput = input}
                  underlineColorAndroid="transparent"
                  clearButtonMode="while-editing"
                  placeholder="0.0"
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={5}
                  onChangeText={(originalBrix) => { this.setState({ originalBrix }); this.doMathOG(); }}
              />           
              {/*Show the calculated value and rounds to 3 decimal places*/}
              <Text style={styles.calculatedSG}>
                {this.state.OG.toFixed(3)}
              </Text>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <View style={styles.footerViewLeft}>
              <Text style={styles.condensed}>
                <Text style={styles.medium}>Equation</Text>
                {'\n'}SG = ((Brix/WCF) / (258.6-(((Brix/WCF) / 258.2)*227.1))) + 1
                {'\n'}{'\n'}<Text style={styles.mediumItalic}>Note: </Text>A Wort Correction Factor (WCF) of 1.040 has been applied.
                This means that this calculator is specifically tuned for beer, not wine, mead or other fermentables
              </Text>
            </View>

            <View style={styles.footerViewRight}>
              <View style={styles.unfermentedInfoButtonTop}>
                <TouchableOpacity onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}>
                  {infoIcon}
                </TouchableOpacity>
              </View>
              <View style={styles.unfermentedInfoButtonBottom}>
                <TouchableOpacity onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}>
                  {infoIcon}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.version}>{version}</Text>
        </View> 
      </ScrollView>
    );
  }
}

class FermentingScreen extends React.Component {

  constructor(props) {
    super(props);
    //Create the ability to set a ref in TextInput
    this.textInput = React.createRef();
    //I don't know what this does
    this.focusTextInput = this.focusTextInput.bind(this);
    //Initialize states to do Math on
    this.state = {
      originalBrix: 0.0,
      OG: 1.000,
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

  //Focus text input function, needs Timeout delay for Tab Navigator quirks
  focusTextInput() {
    setTimeout(
      this.textInput.focus,
      100
    );
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
      //Wrap everything above the Tab Navigator in a ScrollView
      <ScrollView style={styles.scrollViewContainer}>
      {/*Subscribe to Navigation Event onDidFocus, change focus to the Original Brix Input using the ref when this tab is focused*/}
      <NavigationEvents
        onDidFocus={this.focusTextInput}
      />
        <View style={styles.body}>
          <View style={styles.dataTableContainer}>
            <View style={styles.fermentingBodyLeft}>
              <Text style={styles.large}>
                Original Brix
              </Text>
              <Text style={styles.medium}>
                Original Gravity
              </Text>
              <Text style={styles.large}>
                Current Brix
              </Text>
              <Text style={styles.medium}>
                Final Gravity
              </Text>
              <Text style={styles.bigABV}>
                ABV
              </Text>
              <Text style={styles.small}>
                Apparent Attenuation
              </Text>
              <Text style={styles.small}>
                Original Extract
              </Text>
              <Text style={styles.small}>
                Apparent Extract
              </Text>
              <Text style={styles.small}>
                Real Extract
              </Text>
              <Text style={styles.small}>
                ABW
              </Text>
            </View>
            <View style={styles.fermentingBodyRight}>
              <TextInput
                  style={styles.input}
                  ref={input => this.textInput = input}
                  underlineColorAndroid="transparent"
                  clearButtonMode="while-editing"
                  placeholder="0.0"
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={5}
                  onChangeText={(originalBrix) => { this.setState({ originalBrix }); this.doMathOG(); this.doRemainingMath(); }}
                  onSubmitEditing={() => { this.secondTextInput.focus(); }}
              />
              {/*Show the calculated value and rounds to 3 decimal places*/}
              <Text style={styles.calculatedOGFG}>
                {this.state.OG.toFixed(3)}
              </Text>
              <TextInput
                  style={styles.input}
                  ref={input => this.secondTextInput = input}
                  underlineColorAndroid="transparent"
                  clearButtonMode="while-editing"
                  placeholder="0.0"
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={5}
                  onChangeText={(currentBrix) => { this.setState({ currentBrix }); this.doMathFG(); this.doRemainingMath(); }}
                />
              <Text style={styles.calculatedOGFG}>
                {this.state.FG.toFixed(3)}
              </Text>
              <Text style={styles.calculatedABV}>
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
          <View style={styles.footerContainer}>
            <View style={styles.footerViewLeft}>
              <Text style={styles.condensed}>
                <Text style={styles.medium}>Equations</Text>
                {'\n'}OG = ((OB/WCF) / (258.6-(((OB/WCF) / 258.2)*227.1))) + 1
                {'\n'}FG = 1 - 0.000856829 * (OB / WCF) + 0.00349412 * (CB / WCF)
                {'\n'}ABV = ABW * (FG/0.794)
                {'\n'}AA = 100 * (OG – FG)/(OG – 1.0)
                {'\n'}OE = -668.962 + 1262.45 * OG - 776.43 * (OG^2) + 182.94 * (OG^3)
                {'\n'}AE = -668.962 + 1262.45 * FG - 776.43 * (FG^2) + 182.94 * (FG^3)
                {'\n'}RE = 0.8114 * AE + 0.1886 * OE
                {'\n'}ABW = (OE - RE) / (2.0665 - 0.010665 * OE)

                {'\n'}{'\n'}<Text style={styles.mediumItalic}>Note: </Text>A Wort Correction Factor (WCF) of 1.040 has been applied.
                This means that this calculator is specifically tuned for beer, not wine, mead or other fermentables
              </Text>
            </View>
            <View style={styles.footerViewRight}>
              <View style={styles.fermentingInfoButtonTop}>
                <TouchableOpacity onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}>
                  {infoIcon}
                </TouchableOpacity>
              </View>
              <View style={styles.fermentingInfoButtonBottom}>
                <TouchableOpacity onPress={() => Linking.openURL('http://seanterrill.com/2012/01/06/refractometer-calculator/')}>
                  {infoIcon}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.version}>{version}</Text>
        </View>
      </ScrollView>
    );
  }
}

class AboutScreen extends React.Component {
  render() {
    return (
      //Wrap everything above the Tab Navigator in a ScrollView
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.body}>
          <View style={styles.baldrContainer}>
            <Text style={styles.Viking}>Who is Baldr?</Text>
            <Text style={styles.smallCenter}>In Norse mythology Baldr is the God of Light</Text>
            <TouchableOpacity onPress={() => Linking.openURL('http://mythology.wikia.com/wiki/Baldr')}>
            <Image
              style={{width: 265, height: 371, alignSelf: 'center', margin: 4}}
              source={require('./assets/Baldr.jpg')}
            />
            </TouchableOpacity>
            <Text
              style={styles.url}
              onPress={() => Linking.openURL('http://mythology.wikia.com/wiki/Baldr')}
            >
            http://mythology.wikia.com/wiki/Baldr
            </Text>
          </View>
          <Text style={styles.version}>{version}</Text>
        </View>
      </ScrollView>
    )
  }
}

//Figure out which icon to display based on the label (routeName)
const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Icon; //The generic name 'Icon' is the imported MaterialIcons
  let iconName;
  if (routeName === 'Unfermented') {
    iconName = `pause-circle${focused ? '-filled' : '-outline'}`; //Template Literal -> Expression changes the icon name based on if the screen is focused or not
  } else if (routeName === 'Fermenting') {
    iconName = 'bubble-chart'; //There is no -outline variant, so omit backtick Template Literal Expression to check if the screen is focused or not
  } else if (routeName === 'About') {
    iconName = `info${focused ? '' : '-outline'}`;
  }
  //Render the result of all the above
  return <IconComponent name={iconName} size={24} color={tintColor} />;
};

//ROOT COMPONENT
//Wrap the Material Bottom Tab Navigator in createAppContainer
// and pass params to it so that it is styled properly
//Then wrap each tab in a Stack Navigator to get header capabilities
export default createAppContainer(
  createMaterialBottomTabNavigator(
    {
      Unfermented: createStackNavigator({
        Unfermented: {
          screen: UnfermentedScreen,
          navigationOptions: {
            headerTitle: "Unfermented Wort",
            headerStyle: {
              backgroundColor: '#fff9c4',
            },
            headerTitleStyle: {
              fontFamily: 'Montserrat-Bold',
            },
          }
        }
      }),
      Fermenting: createStackNavigator({
        Fermenting: {
          screen: FermentingScreen,
          navigationOptions: {
            headerTitle: "Fermenting Wort",
            headerStyle: {
              backgroundColor: '#fff9c4',
            },
            headerTitleStyle: {
              fontFamily: 'Montserrat-Bold',
            },
          }
        }
      }),
      About: createStackNavigator({
        About: {
          screen: AboutScreen,
          navigationOptions: {
            headerTitle: "About Baldr",
            headerStyle: {
              backgroundColor: '#fff9c4',
            },
            headerTitleStyle: {
              fontFamily: 'Montserrat-Bold',
            },
          }
        }
      })
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
      }),
      activeColor: 'black',
      inactiveColor: 'grey',
      keyboardHidesNavigationBar: false,
      barStyle: { 
        backgroundColor: '#fff9c4',
        paddingVertical: 1
      },
      theme: {
        fonts: { regular: 'Montserrat-Bold' },
      },
    }
  )
);

const styles = StyleSheet.create({
  // Views
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#E1E2E1'
  },
  body: {
    backgroundColor: '#E1E2E1',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 12,
    flex: 1
  },
  dataTableContainer: {
    backgroundColor: '#F8F8F9',
    borderRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12
  },
  footerContainer: {
    backgroundColor: '#F8F8F9',
    borderRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginTop: 12
  },
  baldrContainer: {
    backgroundColor: '#F8F8F9',
    borderRadius: 4,
    elevation: 2,
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    padding: 12,
    //marginTop: 12
  },
  unfermentedBodyLeft: {
    //paddingRight: 24
  },
  unfermentedBodyRight: {
  },
  fermentingBodyLeft: {
    //paddingRight: 58
  },
  fermentingBodyRight: {
  },
  footerViewLeft: {
    flex: 1
  },
  footerViewRight: {
    paddingLeft: 2
  },
  unfermentedInfoButtonTop: {
    justifyContent: 'center',
    flex: 1
  },
  unfermentedInfoButtonBottom: {
    justifyContent: 'center',
    flex: 1
  },
  fermentingInfoButtonTop: {
    justifyContent: 'center',
    flex: 4
  },
  fermentingInfoButtonBottom: {
    justifyContent: 'center',
    flex: 1
  },
  // Fonts
  large: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'left'
  },
  medium: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    paddingTop: 6,
    paddingBottom: 6,
    textAlign: 'left'
  },
  mediumItalic: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Montserrat-BoldItalic'
  },
  small: {
    color: 'black',
    fontFamily: 'Montserrat-SemiBold',
    paddingTop: 2,
    paddingBottom: 2
  },
  smallCenter: {
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    textAlign: 'center'
  },
  condensed: {
    color: 'black',
    fontFamily: 'RobotoCondensed-Light',
    fontSize: 12
  },
  bigABV: {
    color: 'black',
    fontSize: 32,
    fontFamily: 'Montserrat-Bold',
    paddingBottom: 6,
    textAlign: 'left'
  },
  input: {
    backgroundColor: '#e1ffb1',
    color: 'black',
    height: 50,
    width: 80,
    fontSize: 24,
    borderRadius: 4,
    borderWidth: 2,
    textAlign: 'center',
  },
  calculatedSG: {
    color: 'green',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 2
  },
  calculatedOGFG: {
    color: 'green',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 2,
  },
  calculatedABV: {
    color: 'green',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 2
  },
  calculatedSmall: {
    color: 'black',
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 2
  },
  url: {
    color: 'black',
    fontFamily: 'Viking',
    textDecorationLine: 'underline',
    fontSize: 10,
    textAlign: 'center'
  },
  Viking: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Viking'
  },
  version: {
    textAlign: 'center',
    fontSize: 10,
    padding: 16
  }
});
