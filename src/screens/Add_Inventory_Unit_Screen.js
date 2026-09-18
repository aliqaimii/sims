import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, TextInput, BackHandler, Alert } from 'react-native';
import CheckBox from '../components/CheckBox';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MyHeader from '../components/Header';
import { openDatabase } from 'react-native-sqlite-storage';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../theme';


export default class AddInventoryUnitScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UnitID: null,
      UnitName: null,
      UnitSymbol: null,
      ComapanyName: null,
      showUpdateDelete: true,
      HeaderName: "EDIT UNIT"
    }

    const { navigation } = this.props;
    const UID = navigation.getParam('uid', null);
    const UNAME = navigation.getParam('uname', null);
    const USYMBOL = navigation.getParam('usymbol', null);
    this.state.UnitID = UID;
    this.state.UnitName = UNAME;
    this.state.UnitSymbol = USYMBOL;

    if (this.state.UnitID === null) {
      this.state.showUpdateDelete = false;
      this.state.HeaderName = "ADD UNIT"
    }
    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
      }

    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate('UNITS_SCREEN')
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  create = () => {
    var that = this;
    const { ComapanyName } = this.state;
    const { UnitName } = this.state;
    const { UnitSymbol } = this.state;
    if (UnitName !== null) {
      if (UnitSymbol !== null) {
        //////////////////////////////////////////////////////////////////////////////////////////

        var db_name = ComapanyName + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM UnitOfMeasure where IsActive =1 and (UnitName=? or UnitSymbol=?)',
           [UnitName,UnitSymbol], (tx, results) => {
            if (results.rows.length > 0) {
              alert("This Unit already Saved")
            }
            else {

              db.transaction(function (tx) {
                tx.executeSql(

                  'INSERT INTO UnitOfMeasure( UnitName, UnitSymbol) VALUES (?,?)',
                  [UnitName, UnitSymbol],
                  (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        'Success',
                        'Unit Save Successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () =>
                              that.props.navigation.navigate('UNITS_SCREEN'),
                          },
                        ],
                        { cancelable: false }
                      );
                    }
                    else {
                      alert('Registration Failed');
                    }
                  }
                );
              });
            }
          });
        });
        ////////////////////////////////////////////////////////////////////////////////////////////
      }
      else {
        alert("Please Fill Address")
      }

    }
    else {
      alert("Please Fill Email")
    }
  }


  update = () => {
    var that = this;
    const { ComapanyName } = this.state;
    const { UnitID } = this.state;
    const { UnitName } = this.state;
    const { UnitSymbol } = this.state;

    //////////////////////////////////////////////////////////////////////////////////////////
    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE UnitOfMeasure  set UnitName =?  ,UnitSymbol=?  Where UnitID=?',
        [UnitName, UnitSymbol, UnitID],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Updated',
              'Unit Updated Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                    that.props.navigation.navigate('UNITS_SCREEN'),
                },
              ],
              { cancelable: false }
            );
          }
          else {
            alert('Registration Failed');
          }
        }
      );
    });
    ////////////////////////////////////////////////////////////////////////////////////////////

  }


  delete = () => {
    var that = this;
    const { ComapanyName } = this.state;
    const { UnitID } = this.state;
    const { UnitName } = this.state;
    const { UnitSymbol } = this.state;

    //////////////////////////////////////////////////////////////////////////////////////////
    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });
    db.transaction(function (tx) {


      tx.executeSql(
        'SELECT * FROM InventoryItems where UnitID=? AND IsActive =1',
        [UnitID],
        (tx, results) => {

          if (results.rows.length > 0) {
            Alert.alert(
              'Delete Error',
              'Unit cant be Deleted until in use. But You can update it',
              [
                {
                  text: 'Ok'
                },
              ],
              { cancelable: false }
            );
          }
          else {

            tx.executeSql(
              'UPDATE UnitOfMeasure set IsActive= 0  Where UnitID=?',
              [UnitID],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Deleted',
                    'Unit Deleted Successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('UNITS_SCREEN'),
                      },
                    ],
                    { cancelable: false }
                  );
                }
                else {
                  alert('Registration Failed');
                }
              }
            );


          }
        }
      );



    });
    ////////////////////////////////////////////////////////////////////////////////////////////

  }

  render() {
    return (
      <View style={styles.container}>

        <MyHeader
          title={this.state.HeaderName}
          backGroundColor={colors.primary}
          go={() => this.props.navigation.navigate('STARTSCREEN')}
        />
        <View style={styles.view1}>
          <Text style={styles.textstyle}>Unit Name</Text>
          <TextInput autoFocus={true} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.usymbol.focus()}
            placeholder='Please Enter Unit Name' value={this.state.UnitName} style={styles.textInputStyle} onChangeText={(text) => { this.setState({ UnitName: text }) }} />
          <Text style={styles.textstyle}>Unit Symbol</Text>
          <TextInput ref={ref => this.usymbol = ref} placeholder='Enter Unit Symbol'
            value={this.state.UnitSymbol} style={styles.textInputStyle} onChangeText={(text) => { this.setState({ UnitSymbol: text }) }} />

          {this.state.showUpdateDelete ?

            <  TouchableOpacity style={styles.buttonStyle} onPress={this.update}>
              <View >

                <Text style={styles.buttonTextStyle}>UPDATE</Text>

              </View>
            </TouchableOpacity>



            : null}


          {this.state.showUpdateDelete ?

            <TouchableOpacity style={styles.buttonStyle} onPress={() => {
              Alert.alert(
                'Delete Unit',
                'Are you Sure to Delete Unit  ' + this.state.UnitName + " ?",
                [
                  { text: 'Cancel' },
                  {
                    text: 'Confrom',
                    onPress: this.delete,
                  },


                ],

              );
            }}>
              <View >

                <Text style={styles.buttonTextStyle}>DELETE</Text>

              </View>
            </TouchableOpacity>



            : <  TouchableOpacity style={styles.buttonStyle} onPress={this.create}>
              <View >

                <Text style={styles.buttonTextStyle}>CREATE</Text>

              </View>
            </TouchableOpacity>}


        </View>



      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  view1: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.border,
    borderBottomWidth: 0,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
  },
  textstyle: {
    marginLeft: 12, paddingTop: 12

  },
  textInputStyle: {
    borderBottomWidth: 1,borderColor:colors.primary, width: ('95%'), marginLeft: 12, height: 40,
    fontSize: 18,

  },

  buttonStyle: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    alignSelf: "center",
    textAlign: 'center',
    margin: 8,
    marginTop: 12,
    marginBottom: 12,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    borderRadius: 8,

    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    elevation: 2,
  },
  buttonTextStyle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
    color: colors.textOnDark,
    margin:8
  },

});


  // CheakBoxClick(){

  //     this.setState({
  //       cheakBoxValue:!this.state.cheakBoxValue
  //     })
  //   }