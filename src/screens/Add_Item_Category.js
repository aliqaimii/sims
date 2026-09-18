


import MyHeader from '../components/Header';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Alert, BackHandler, ScrollView, TextInput, yKeyboardAvoidingView, keyboardVerticalOffset } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import { colors } from '../theme';
export default class Add_Item_Category extends Component {



  constructor(props) {
    super(props);
    this.state = {
      ItemCategoryID: null,
      ItemCategoryName: null,
      ComapanyName: null,
      showUpdateDelete: true,
      HeaderName: "EDIT CATEGORY"
    };


    const { navigation } = this.props;
    const ICID = navigation.getParam('icid', null);
    const ICNAME = navigation.getParam('icname', null);


    this.state.ItemCategoryID = ICID;
    this.state.ItemCategoryName = ICNAME;


    if (this.state.ItemCategoryID === null) {
      this.state.showUpdateDelete = false;
      this.state.HeaderName = "ADD CATEGORY"
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
      this.props.navigation.navigate('ITEMS_CATEGORY')
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }



  SetItemCategoryName = (text) => {
    this.setState({ ItemCategoryName: text })
  }




  create = () => {

    var that = this;
    const { ComapanyName } = this.state;
    const { ItemCategoryName } = this.state;



    //////////////////////////////////////////////////////////////////////////////////////////

    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM  ItemCategory where IsActive =1 and ItemCategoryName=? ',
       [ItemCategoryName], (tx, results) => {
        if (results.rows.length > 0) {
          alert("This Category already Saved")
        }
        else {

    db.transaction(function (tx) {

      tx.executeSql(

        'INSERT INTO  ItemCategory ( ItemCategoryName ) VALUES (?)',
        [ItemCategoryName],
        (tx, results) => {
          //             alert(results.rowsAffected
          //  );
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Item Category Added Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                    that.props.navigation.navigate('ITEMS_CATEGORY'),
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


  update = () => {


    var that = this;
    const { ComapanyName } = this.state;
    const { ItemCategoryID } = this.state;
    const { ItemCategoryName } = this.state;



    //////////////////////////////////////////////////////////////////////////////////////////

    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });

    db.transaction(function (tx) {

      tx.executeSql(

        'UPDATE ItemCategory  set ItemCategoryName=? where ItemCategoryID=?',

        [ItemCategoryName, ItemCategoryID],
        (tx, results) => {
          //             alert(results.rowsAffected
          //  );
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Item Category Updated Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                    that.props.navigation.navigate('ITEMS_CATEGORY'),
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
    const { ItemCategoryID } = this.state;



    //////////////////////////////////////////////////////////////////////////////////////////

    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });

    db.transaction(function (tx) {

      tx.executeSql(

        'SELECT * FROM InventoryItems where ItemCategoryID=? AND IsActive =1',
        [ItemCategoryID],
        (tx, results) => {
          if (results.rows.length > 0) {
            Alert.alert(
              'Delete Error',
              'Item Category cant be Deleted until in use. But You can update it',
              [
                {
                  text: 'Ok',

                },
              ],
              { cancelable: false }
            );
          }
          else {

            tx.executeSql(

              'UPDATE ItemCategory  set IsActive= 0 where ItemCategoryID=?',

              [ItemCategoryID],
              (tx, results) => {
                //             alert(results.rowsAffected
                //  );
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'Item Category Deleted Successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('ITEMS_CATEGORY'),
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

          <Text style={styles.textstyle}>Category Name</Text>
          <TextInput underlineColor={colors.primary} autoFocus={true} returnKeyType="next"
            placeholder='Please Enter Category Name' value={this.state.ItemCategoryName}
            style={styles.textInputStyle} onChangeText={this.SetItemCategoryName} />
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
                'Delete Category',
                'Are you Sure to Delete Category  ' + this.state.ItemCategoryName + " ?",
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
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'center',
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
  textstyle: {
    marginLeft: 12, paddingTop: 12

  },
  textInputStyle: {
    borderBottomWidth: 1.5, width: ('95%'), marginLeft: 12, height: 40,
    fontSize: 18,
    marginBottom: 12,
    marginTop: 12,
  }
});













