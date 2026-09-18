import MyHeader from '../components/Header';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Alert, BackHandler, ScrollView, KeyboardAvoidingView, keyboardVerticalOffset } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import DatePicker from '../components/DatePicker';
import { TextInput } from 'react-native-paper'
import { colors } from '../theme';
export default class Add_Supplier_Screen extends Component {



  constructor(props) {
    super(props);
    this.state = {
      SupplierID: null,
      SupplierName: null,
      SupplierPhoneNumber: null,
      SupplierEmail: null,
      SupplierAddress: null,
      finacial_year_starting_date: null,
      ComapanyName: null,
      showUpdateDelete: true,
      HeaderName:"EDIT SUPPLIER"
    };


    const { navigation } = this.props;
    const SID = navigation.getParam('sid', null);
    const SNAME = navigation.getParam('sname', null);
    const SPHONENO = navigation.getParam('sphoneno', null);
    const SEMAIL = navigation.getParam('semail', null);
    const SADDRESS = navigation.getParam('saddress', null);

    this.state.SupplierID = SID;
    this.state.SupplierName = SNAME;
    this.state.SupplierPhoneNumber = SPHONENO;
    this.state.SupplierEmail = SEMAIL;
    this.state.SupplierAddress = SADDRESS;

    if(this.state.SupplierID === null)
    {
      this.state.showUpdateDelete=false;
      this.state.HeaderName="ADD SUPPLIER"
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
      this.props.navigation.navigate('SUPPLIERS_SCRREN')
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }



  SetSupplierName = (text) => {
    this.setState({ SupplierName: text })
  }


  SetSupplierPhoneNumber = (text) => {
    this.setState({ SupplierPhoneNumber: text })
  }

  SetSupplierEmail = (text) => {
    this.setState({ SupplierEmail: text })
  }
  SetSupplierAddress = (text) => {
    this.setState({ SupplierAddress: text })
  }

  set_finacial_year_starting_date = (text) => {
    this.setState({ finacial_year_starting_date: text })
  }


  create = () => {

    var that = this;
    const { ComapanyName } = this.state;
    const { SupplierName } = this.state;
    const { SupplierPhoneNumber } = this.state;
    const { SupplierEmail } = this.state;
    const { SupplierAddress } = this.state;


    if (SupplierName !== null) {
      if (SupplierPhoneNumber !== null) {
        if (SupplierEmail !== null) {
          if (SupplierAddress !== null) {
            //////////////////////////////////////////////////////////////////////////////////////////

            var db_name = ComapanyName + ".db";
            db_name = db_name.replace(/\s/g, '');
            var db = openDatabase({ name: db_name });
            db.transaction(tx => {
              tx.executeSql('SELECT * FROM  Suppliers where (IsActive =1) and (SupplierPhoneNumber=? or  SupplierEmail=? or SupplierAddress=?)', 
              [ SupplierPhoneNumber, SupplierEmail, SupplierAddress], (tx, results) => {
                if (results.rows.length > 0) {
                  alert("This Supplier Already Exists.")
                }
                else {
               
            db.transaction(function (tx) {
              tx.executeSql(

                'INSERT INTO  Suppliers( SupplierName, SupplierPhoneNumber, SupplierEmail,SupplierAddress) VALUES (?,?,?,?)',
                [SupplierName, SupplierPhoneNumber, SupplierEmail, SupplierAddress],
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
                            that.props.navigation.navigate('SUPPLIERS_SCRREN'),
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
    const { SupplierName } = this.state;
    const { SupplierPhoneNumber } = this.state;
    const { SupplierEmail } = this.state;
    const { SupplierAddress } = this.state;
    const { SupplierID } = this.state;



    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });

    db.transaction(function (tx) {

      tx.executeSql(

        'UPDATE Suppliers set SupplierName = ?, SupplierPhoneNumber = ?, SupplierEmail = ?,SupplierAddress = ? Where SupplierID = ?',
        [SupplierName, SupplierPhoneNumber, SupplierEmail, SupplierAddress, SupplierID],
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
                    that.props.navigation.navigate('SUPPLIERS_SCRREN'),
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
    const { SupplierID } = this.state;
    
    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });

    db.transaction(function (tx) {

      
      tx.executeSql(
        'SELECT * FROM InventoryItems where IsActive =1 AND SupplierID=? ',
        [SupplierID],
        (tx, results) => {
          if (results.rows.length > 0) {
            Alert.alert(
              'Delete Error',
              'Supplier cant be Deleted until in use. But You can update its Details',
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

              'UPDATE Suppliers  set IsActive= 0 where SupplierID=?',
              [SupplierID],
              (tx, results) => {
                //             alert(results.rowsAffected
                //  );
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Deleted',
                    'You are Delete Supplier Successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('SUPPLIERS_SCRREN'),
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

            <TextInput underlineColor={colors.primary} autoFocus={true} style={styles.TextInputStyle} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.usernameref.focus()} label="Name :" value={this.state.SupplierName} onChangeText={this.SetSupplierName} />
            <TextInput underlineColor={colors.primary} style={styles.TextInputStyle} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.passwordref.focus()} ref={ref => this.usernameref = ref} label="Phone No :" value={this.state.SupplierPhoneNumber} onChangeText={this.SetSupplierPhoneNumber} keyboardType="numeric" />
            <TextInput underlineColor={colors.primary} style={styles.TextInputStyle} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.retypepasswordref.focus()} ref={ref => this.passwordref = ref} label="Email :" value={this.state.SupplierEmail} onChangeText={this.SetSupplierEmail} keyboardType="email-address" />
            <TextInput underlineColor={colors.primary} style={styles.TextInputStyle} returnKeyType="done" ref={ref => this.retypepasswordref = ref} label="Address :" value={this.state.SupplierAddress} onChangeText={this.SetSupplierAddress} keyboardType="default" />




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
        
        <TouchableOpacity style={styles.buttonStyle} onPress={()=>{Alert.alert(
          'Sure To Delete Supplier',
          'Are you Sure to Delete Supplier  '+this.state.SupplierName+" ?",
          [
            {text: 'Cancel'},
            {
              text: 'Confrom',
              onPress:  this.delete,
            },


          ],
        
        );}}>
        <View >

          <Text style={styles.buttonTextStyle}>DELETE</Text>

        </View>
      </TouchableOpacity>

 
        
        :  <  TouchableOpacity style={styles.buttonStyle} onPress={this.create}>
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
    textAlign: 'center',
    color: colors.textOnDark,
    margin: 8,
  },

  buttonTextStyle1: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  TextInputStyle: {

    margin: 8,
    backgroundColor: colors.surface,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',


  }
});













