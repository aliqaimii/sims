import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Button, Alert, TextInput, BackHandler, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyHeader from '../components/Header';
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwsome from 'react-native-vector-icons/dist/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FloatingAction } from "../components/FloatingAction";
import { colors } from '../theme';

export default class Sell_Deatail_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      InvoiceID: "",
      TransactionType: "",
      onBackTransactionType:"",
      ButtonVisible: false,
      InvoiceDetails: [],
      FlatListItems: [],


    }


    const { navigation } = this.props;
    const INVID = navigation.getParam('invid', null);
    this.state.InvoiceID = INVID;
    const TRANCATIONSTYPE = navigation.getParam('transType', null);
    this.state.onBackTransactionType = TRANCATIONSTYPE;

    

    this.getItems();




  }




  getItems = () => {


    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        // alert(this.state.ComapanyName);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {

          tx.executeSql('SELECT * FROM  Invoices where IsActive =1 AND InvoiceID = ? ',
            [this.state.InvoiceID], (tx, results) => {

              if (results.rows.length > 0) {
                this.state.InvoiceDetails = results.rows.item(0);
                if (this.state.InvoiceDetails.OnCash === 1) {
                  this.state.TransactionType = "Clear"
                }
                else {
                  this.state.TransactionType = "On loan"
                  this.state.ButtonVisible = true;

                }
              }

            });




          tx.executeSql('SELECT * FROM  InvoiceDetails where IsActive =1 AND InvoiceID = ? ',
            [this.state.InvoiceID], (tx, results) => {
              var temp = [];

              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              this.setState({
                FlatListItems: temp,
              });
            });
        });

      }

    });






  }



  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
     
        this.props.navigation.navigate('ALL_SELL_SCREEN',{transType:this.state.onBackTransactionType});

      
      
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  onclear =()=>{

    
    

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        // alert(this.state.ComapanyName);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {

          tx.executeSql('UPDATE Invoices  SET  OnCash = 1 where  InvoiceID = ? ',
          [this.state.InvoiceID], (tx, results) => {

            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'Transection Clear Successfully',
                [
                  {
                    text: 'Ok',
                    onPress: () =>
                    this.props.navigation.navigate('ALL_SELL_SCREEN',{transType:this.state.onBackTransactionType})

                  },
                ],
                { cancelable: false }
              );
            
             }

            });




    
        });

      }

    });






  



  }
  render() {
    return (


      <View style={styles.container}>
        <MyHeader
          title={"SALE DETAIL"}
          backGroundColor={colors.primary}
        />

        <View style={styles.upperView}>

          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center", backgroundColor: colors.primaryLight }}>
            <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>Date :   </Text>
            <Text style={{ fontSize: 20, color: colors.textOnDark }}>{this.state.InvoiceDetails.Date}</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center",marginTop:12 }}>
            <Text style={{ fontSize: 24, color: colors.textOnDark, marginLeft: 20 }}>Customer Name :   </Text>
            <Text style={{ fontSize: 24, color: colors.textOnDark }}>{this.state.InvoiceDetails.CustomerName}</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center", }}>
            <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: 20 }}>Ammount :   </Text>
            <Text style={{ fontSize: 18, color: colors.onPrimary }}>{this.state.InvoiceDetails.TotalAmmount}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center", }}>
            <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: 20 }}>Payment   :   </Text>
            <Text style={{ fontSize: 18, color: colors.onPrimary }}>{this.state.TransactionType}</Text>
          </View>
          {this.state.ButtonVisible ?
            <TouchableOpacity style={styles.buttonStyle1}onPress={() => {
              Alert.alert(
                'Clear Loan',
                'Are you Sure to Clear loan of  '+this.state.InvoiceDetails.CustomerName + " Of Amount "+this.state.InvoiceDetails.TotalAmmount,
                [
                  { text: 'Cancel' },
                  {
                    text: 'Confirm',
                    onPress: this.onclear,
                  },


                ],

              );
            }}>
              <View >

                <Text style={styles.buttonTextStyle}>Clear Transaction</Text>

              </View>
            </TouchableOpacity> : null}

        </View>



        <FlatList style={styles.flatelistStyle}
          data={this.state.FlatListItems}

          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item.InvoiceID} style={styles.flatelistViewStyle}>
              <TouchableOpacity style={styles.buttonStyle}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "45%", justifyContent: "center", backgroundColor: colors.primary }}>
                    <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>Item : {item.ItemName}</Text>
                    <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: '10%' }}>Amount :  {item.PerUnitSellprice * item.ItemQuantity}</Text>
                  </View>
                  <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "flex-start", backgroundColor: colors.primaryLight, width: '55%' }}>
                    <Text style={{ fontSize: 16, color: colors.textOnDark,marginLeft:20 }}>Unit Price  :  {item.PerUnitSellprice}</Text>
                    <Text style={{ fontSize: 16, color: colors.textOnDark,marginLeft:20 }}>Quantity    :  {item.ItemQuantity}</Text>

                  </View>
                </View>
              </TouchableOpacity>


            </View>
          )}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  flatelistStyle: {
    backgroundColor: colors.surface,
    marginTop: hp('5'),
    marginBottom: hp('6'),
    paddingBottom: 8,
    width: '98%'

  },
  buttonStyle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,

    borderRadius: 8,
    color: colors.textPrimary,
    fontSize: hp('3%'),
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    elevation: 2,

  }, flatelistViewStyle: {


    padding: 4,

  },
  upperView: {
    height: 200,
    width: '98%',
    marginTop: 20,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,

    borderRadius: 8,
    color: colors.textPrimary,
    fontSize: hp('3%'),
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    elevation: 2,

  },

  buttonStyle1: {
    backgroundColor: colors.primary,
    alignSelf: "center",
    textAlign: 'center',
    margin: 8,
    marginTop: 20,
    width: '90%',
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
    fontSize: 20,
    textAlign: 'center',
    color: colors.textOnDark,
    marginBottom: 8,
  }
});
