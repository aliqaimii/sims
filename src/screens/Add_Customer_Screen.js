import MyHeader from '../components/Header';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Alert, BackHandler, ScrollView, KeyboardAvoidingView, keyboardVerticalOffset } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import DatePicker from '../components/DatePicker';
import { TextInput } from 'react-native-paper'
import { colors } from '../theme';
export default class Add_Customer_Screen extends Component {



  constructor(props) {
    super(props);
    this.state = {
      CustomerID: null,
      CustomerName: null,
      CustomerPhoneNumber: null,
      CustomerEmail: null,
      CustomerAddress: null,
      finacial_year_starting_date: null,
      ComapanyName: null,
      showUpdateDelete: true,
      HeaderName: "EDIT CUSTOMER"
    };


    const { navigation } = this.props;
    const CID = navigation.getParam('cid', null);
    const CNAME = navigation.getParam('cname', null);
    const CPHONENO = navigation.getParam('cphoneno', null);
    const CEMAIL = navigation.getParam('cemail', null);
    const CADDRESS = navigation.getParam('caddress', null);

    this.state.CustomerID = CID;
    this.state.CustomerName = CNAME;
    this.state.CustomerPhoneNumber = CPHONENO;
    this.state.CustomerEmail = CEMAIL;
    this.state.CustomerAddress = CADDRESS;

    if (this.state.CustomerID === null) {
      this.state.showUpdateDelete = false;
      this.state.HeaderName = "ADD CUSTOMER"
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
      this.props.navigation.navigate('CUSTOMERS_SCRREN')
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }



  SetCustomerName = (text) => {
    this.setState({ CustomerName: text })
  }


  SetCustomerPhoneNumber = (text) => {
    this.setState({ CustomerPhoneNumber: text })
  }

  SetCustomerEmail = (text) => {
    this.setState({ CustomerEmail: text })
  }
  SetCustommerAddress = (text) => {
    this.setState({ CustomerAddress: text })
  }

  set_finacial_year_starting_date = (text) => {
    this.setState({ finacial_year_starting_date: text })
  }


  create = () => {

    var that = this;
    const { ComapanyName } = this.state;
    const { CustomerName } = this.state;
    const { CustomerPhoneNumber } = this.state;
    const { CustomerEmail } = this.state;
    const { CustomerAddress } = this.state;


    if (CustomerName !== null) {
      if (CustomerPhoneNumber !== null) {
        if (CustomerEmail !== null) {
          if (CustomerAddress !== null) {
            //////////////////////////////////////////////////////////////////////////////////////////

            var db_name = ComapanyName + ".db";
            db_name = db_name.replace(/\s/g, '');
            var db = openDatabase({ name: db_name });

            db.transaction(tx => {
              tx.executeSql('SELECT * FROM  Customers where (IsActive =1) and (CustomerPhoneNumber=? or  CustomerEmail=? or CustomerAddress=?)', 
              [ CustomerPhoneNumber, CustomerEmail, CustomerAddress], (tx, results) => {
                if (results.rows.length > 0) {
                  alert("This Customer Already Exists.")
                }
                else {

            db.transaction(function (tx) {

              tx.executeSql(

                'INSERT INTO  Customers( CustomerName, CustomerPhoneNumber, CustomerEmail,CustomerAddress) VALUES (?,?,?,?)',
                [CustomerName, CustomerPhoneNumber, CustomerEmail, CustomerAddress],
                (tx, results) => {
                  //             alert(results.rowsAffected
                  //  );
                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      'You are Registered Successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () =>
                            that.props.navigation.navigate('CUSTOMERS_SCRREN'),
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
      else {
        alert("Please Fill Phone No")
      }
    }
    else {
      alert("Please Fill Name")
    }


  }


  update = () => {

    var that = this;
    const { ComapanyName } = this.state;
    const { CustomerName } = this.state;
    const { CustomerPhoneNumber } = this.state;
    const { CustomerEmail } = this.state;
    const { CustomerAddress } = this.state;
    const { CustomerID } = this.state;



    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });

    db.transaction(function (tx) {

      tx.executeSql(

        'UPDATE Customers set CustomerName = ?, CustomerPhoneNumber = ?, CustomerEmail = ?,CustomerAddress = ? Where CustomerID = ?',
        [CustomerName, CustomerPhoneNumber, CustomerEmail, CustomerAddress, CustomerID],
        (tx, results) => {
          //             alert(results.rowsAffected
          //  );
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Updated Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                    that.props.navigation.navigate('CUSTOMERS_SCRREN'),
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


  delete = () => {
    var that = this;

    const { ComapanyName } = this.state;
    const { CustomerID } = this.state;

    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });

    db.transaction(function (tx) {


      tx.executeSql(

        'Select * from Invoices where IsActive =1  AND CustomerID = ?',
        [CustomerID],
        (tx, results) => {
          if(results.rows.length>0)
          {
            Alert.alert(
              'Delete Error',
              'This Customer cant be Deleted. But You can update its Details',
              [
                {
                  text: 'Ok'
                },
              ],
              { cancelable: false }
            );
          }
          else{
            tx.executeSql(

              'UPDATE Customers  set IsActive= 0 where CustomerID=?',
              [CustomerID],
              (tx, results) => {
                //             alert(results.rowsAffected
                //  );
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Deleted',
                    'You are Delete Customer Successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('CUSTOMERS_SCRREN'),
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


     
    

  }



  render() {
    return (
      <View style={styles.container}>

        <MyHeader

          title={this.state.HeaderName}

          backGroundColor={colors.primary}


        />

        <ScrollView contentContainerStyle={styles.scroll}>
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset} style={styles.form}>

            <TextInput style={styles.TextInputStyle} autoFocus={true} underlineColor={colors.primary} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.usernameref.focus()} label="Name :" value={this.state.CustomerName} onChangeText={this.SetCustomerName} />
            <TextInput style={styles.TextInputStyle} underlineColor={colors.primary} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.passwordref.focus()} ref={ref => this.usernameref = ref} label="Phone No :" value={this.state.CustomerPhoneNumber} onChangeText={this.SetCustomerPhoneNumber} keyboardType="numeric" />
            <TextInput style={styles.TextInputStyle} underlineColor={colors.primary} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.retypepasswordref.focus()} ref={ref => this.passwordref = ref} label="Email :" value={this.state.CustomerEmail} onChangeText={this.SetCustomerEmail} keyboardType="email-address" />
            <TextInput style={styles.TextInputStyle} underlineColor={colors.primary} returnKeyType="done" ref={ref => this.retypepasswordref = ref} label="Address :" value={this.state.CustomerAddress} onChangeText={this.SetCustommerAddress} keyboardType="default" />




          </KeyboardAvoidingView>



          {/*Here we will return the view when state is true 
        and will return false if state is false*/}
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
                'Sure To Delete Customer',
                'Are you Sure to Delete Customer  ' + this.state.CustomerName + " ?",
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



        </ScrollView>



      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  form: {
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    textAlign: 'center',
    margin: 8,
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
    justifyContent:"center",
    textAlign: 'center',
    color: colors.textOnDark,
    margin: 8,
  },
  TextInputStyle: {
    margin: 8,
    backgroundColor: colors.surface,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  }
});













