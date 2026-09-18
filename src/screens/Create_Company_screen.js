import MyHeader from '../components/Header';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Alert, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import DatePicker from '../components/DatePicker';
import { TextInput } from 'react-native-paper'
import { colors } from '../theme';
export default class create_company_screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: null,
      user_name: null,
      user_password: null,
      secure_password_entry: true,
      ShowHide_password_lable: "Show  Password",
      user_retype_password: null,
      finacial_year_starting_date: null,

      FavouriteColor: null,
      FavouriteCity: null,
      FavouritePerson: null,

      isView1Visible: true,
      isView2Visible: false,
      istext1Visible: false,
      istext2Visible: true,


    };
  }

  ////////////////////  Start  ///////////////////
  ////////////////////manage date and backgesture just///////////////////
  componentDidMount() {
    var monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = monthNames[new Date().getMonth()]; //Current Month
    var year = new Date().getFullYear(); //Current Year

    that.setState({
      //Setting the value of the date time
      finacial_year_starting_date:
        date + '-' + month + '-' + year,
    });

    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Creating Company", "Are you sure to Cancel ",
        [{ text: "NO", onPress: () => { }, style: "cancel" },
        { text: "Yes", onPress: () => this.handelExit() }], { cancelable: true });
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handelExit() {
    this.props.navigation.navigate('STARTSCREEN')
  }
  ////////////////////manage date and backgesture just///////////////////
  ////////////////////  finsih   ///////////////////

  /////////////////////////start/////////////////////////////
  ////////////////set text input value to variables/////////////
  setcompanyname = (text) => {
    this.setState({ ComapanyName: text })
  }


  set_user_name = (text) => {
    this.setState({ user_name: text })
  }

  set_user_password = (text) => {
    this.setState({ user_password: text })
  }
  set_user_re_type_password = (text) => {
    this.setState({ user_retype_password: text })
  }

  set_finacial_year_starting_date = (text) => {
    this.setState({ finacial_year_starting_date: text })
  }


  /////////////////////////finish/////////////////////////////
  ////////////////set text input value to variables/////////////


  onText1Press = () => {
    if (this.state.secure_password_entry === true) {
      this.setState({ secure_password_entry: false })
      this.setState({ ShowHide_password_lable: "Hide  Password" })

    }
    else {
      this.setState({ secure_password_entry: true })
      this.setState({ ShowHide_password_lable: "Show  Password" })



    }
    // this.setState({isVisibleView1:true})
  }



  firstTimeUSe = async () => {
    try {
      await AsyncStorage.setItem('firsttime', "1");
    } catch (error) {
    }
  }


  create = () => {
    var that = this;
    const { ComapanyName } = this.state;
    const { user_name } = this.state;
    const { user_password } = this.state;
    const { user_retype_password } = this.state;
    const { finacial_year_starting_date } = this.state;
    const { FavouriteColor } = this.state;
    const { FavouriteCity } = this.state;
    const { FavouritePerson } = this.state;



    if (ComapanyName !== null) {
      if (user_name !== null) {
        if (user_password !== null) {
          if (user_password.length <= 7) {
            alert("Password Have Atlest 8 Character")
            return;
          }
          if (user_retype_password !== null) {
            if (finacial_year_starting_date !== null) {
              //////////////////////////////////////////////////////////////////////////////////////////

              if (user_password === user_retype_password) {
                if (this.state.FavouriteColor !== null) {
                  if (this.state.FavouriteCity !== null) {
                    if (this.state.FavouritePerson !== null)  
                    {

                    this.firstTimeUSe();
                    var db = openDatabase({ name: "MainDatebase" });
                    db.transaction(function (txn) {

                      txn.executeSql('SELECT * FROM CompanyDetails where CompanyName = ?',
                        [ComapanyName],
                        (txn, results) => {
                          if (results.rows.length > 0) {
                            alert("You alreday maked company from " + ComapanyName + " Name.")

                          }
                          else {
                            var db = openDatabase({ name: "MainDatebase" });
                            db.transaction(function (txn) {
                              txn.executeSql('INSERT INTO CompanyDetails(CompanyName , Date)  VALUES (?,?)',
                                [ComapanyName, finacial_year_starting_date],
                              );

                            });

                            var db_name = ComapanyName + ".db";
                            db_name = db_name.replace(/\s/g, '');
                            var db = openDatabase({ name: db_name });

                            db.transaction(function (txn) {
                              txn.executeSql(
                                "SELECT name FROM sqlite_master WHERE type='table' AND name='LOGIN_TABLE'",
                                [],
                                function (txn, res) {
                                  if (res.rows.length == 0) {
                                    txn.executeSql('DROP TABLE IF EXISTS LOGIN_TABLE', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS LOGIN_TABLE(comapny_name VARCHAR(50) PRIMARY KEY , user_name VARCHAR(20), user_password VARCHAR(10), finacial_year_starting_date VARCHAR(20),Favourite_color VARCHAR(20),Favourite_City VARCHAR(20),Favourite_Person VARCHAR(20))', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS Customers(CustomerID INTEGER PRIMARY KEY AUTOINCREMENT, CustomerName VARCHAR(20) NOT NULL, CustomerPhoneNumber VARCHAR(20) NOT NULL, CustomerEmail VARCHAR(50), CustomerAddress VARCHAR(50) NOT NULL, Date VARCHAR(30) ,IsActive INTEGER DEFAULT 1 )', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS Suppliers(SupplierID INTEGER PRIMARY KEY AUTOINCREMENT, SupplierName VARCHAR(20) NOT NULL, SupplierPhoneNumber VARCHAR(20) NOT NULL, SupplierEmail VARCHAR(50), SupplierAddress VARCHAR(50) NOT NULL, Date VARCHAR(30) ,IsActive INTEGER DEFAULT 1 )', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS UnitOfMeasure(UnitID INTEGER PRIMARY KEY AUTOINCREMENT, UnitName VARCHAR(20) NOT NULL, UnitSymbol VARCHAR(20),IsActive INTEGER DEFAULT 1 )', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS AccountGroups(AccountTypeID INTEGER PRIMARY KEY AUTOINCREMENT, AccountName VARCHAR(20) NOT NULL,  AccountAmmount INTEGER )', []);


                                    /////////////////////////////////////////////////////////
                                    //////////////////item and inventory/////////////////////

                                    txn.executeSql('CREATE TABLE IF NOT EXISTS ItemCategory(ItemCategoryID INTEGER PRIMARY KEY AUTOINCREMENT, ItemCategoryName VARCHAR(20) NOT NULL, IsActive INTEGER DEFAULT 1  )', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS ItemSubCategory(ItemSubCategoryID INTEGER PRIMARY KEY AUTOINCREMENT, ItemSubCategoryName VARCHAR(20) NOT NULL, ItemCategoryID INTEGER, IsActive INTEGER DEFAULT 1  )', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS InventoryItems(ItemID INTEGER PRIMARY KEY AUTOINCREMENT, ItemName VARCHAR(20) NOT NULL, ItemDescription VARCHAR(100), ItemCode VARCHAR(30), ItemBarcode VARCHAR(30), UnitID INTEGER, ItemCategoryID INTEGER, SupplierID INTEGER,  PerUnitCostPrice VARCHAR(10) NOT NULL, PerUnitSellprice VARCHAR(10) NOT NULL,CurrentStock VARCHAR(10), MinimumStock VARCHAR(10) , AsOFDate VARCHAR(30), IsActive INTEGER DEFAULT 1 )', []);


                                    //////////////////////////////////////////////////
                                    //////////////////////invoice////////////////////
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS Invoices(InvoiceID INTEGER PRIMARY KEY AUTOINCREMENT ,CustomerID INTEGER NOT NULL , CustomerName VARCHAR(20)  ,Date VARCHAR(30) NOT NULL,TotalAmmount INTEGER NOT NULL, OnCash INTEGER NOT NULL, IsActive INTEGER DEFAULT 1)', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS InvoiceDetails(InvoiceDetailID INTEGER PRIMARY KEY AUTOINCREMENT, ItemID INTEGER NOT NULL, ItemName VARCHAR(20), InvoiceID INTEGER NOT NULL, ItemQuantity INTEGER NOT NULL, PerUnitSellprice VARCHAR(10) NOT NULL,Date VARCHAR(30) NOT NULL, IsActive INTEGER DEFAULT 1)', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS TempInvoiceItems(ItemID INTEGER PRIMARY KEY , ItemName VARCHAR(20) NOT NULL,  ItemQuantity INTEGER NOT NULL, PerUnitSellprice VARCHAR(10) NOT NULL,CurrentStock INTEGER NOT NULL)', []);



                                    ////////////////////////////////////////////////////////////////////////
                                    //////////////////////purchaseinvoice////////////////////
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS Purchase(PurchaseID INTEGER PRIMARY KEY AUTOINCREMENT ,SupplierID INTEGER NOT NULL , SupplierName VARCHAR(20)  ,Date VARCHAR(30) NOT NULL,TotalAmmount INTEGER NOT NULL, OnCash INTEGER NOT NULL, IsActive INTEGER DEFAULT 1)', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS PurchaseDetails(PurchaseInvoiceDetailID INTEGER PRIMARY KEY AUTOINCREMENT, ItemID INTEGER NOT NULL, ItemName VARCHAR(20), PurchaseID INTEGER NOT NULL, ItemQuantity INTEGER NOT NULL, PerUnitCostprice VARCHAR(10) NOT NULL,Date VARCHAR(30) NOT NULL, IsActive INTEGER DEFAULT 1)', []);
                                    txn.executeSql('CREATE TABLE IF NOT EXISTS PurchaseTempItems(ItemID INTEGER PRIMARY KEY , ItemName VARCHAR(20) NOT NULL,  ItemQuantity INTEGER NOT NULL, PerUnitCostprice VARCHAR(10) NOT NULL,CurrentStock INTEGER NOT NULL)', []);

                                    /////////////////////////////////////////////////
                                    /// table cheak if created or not
                                    // txn.executeSql(
                                    //   "SELECT name FROM sqlite_master WHERE type='table' AND name='InventoryItems'",
                                    //   [],
                                    //   function (txn, res) {
                                    //     if (res.rows.length >0) {
                                    //       console.log("Table Created")
                                    //     }
                                    //   }
                                    // );

                                    ////////////////////////////////////////
                                  }
                                },
                              );
                            });

                            var db = openDatabase({ name: db_name });
                            db.transaction(function (tx) {
                              tx.executeSql(

                                'INSERT INTO  LOGIN_TABLE(comapny_name, user_name, user_password,finacial_year_starting_date,Favourite_color,Favourite_City,Favourite_Person) VALUES (?,?,?,?,?,?,?)',
                                [ComapanyName, user_name, user_password, finacial_year_starting_date,FavouriteColor,FavouriteCity,FavouritePerson],
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
                                            that.props.navigation.navigate('STARTSCREEN'),
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
                        }
                      );

                    });





                  }
                  else {
                    alert("Please Enter Your Favourite Person Name")
                  }
                  
                }
                  else {
                    alert("Please Enter Your Favourite City Name")
                  }

                }
                else {
                  alert("Please Enter Your Favourite Color Name")
                }

              }
              else {
                alert("your password did not match");
              }

              ////////////////////////////////////////////////////////////////////////////////////////////
            }
            else {
              alert("Please select Date")
            }

          }
          else {
            alert("Please Fill User RetypePassword")
          }
        }
        else {

          alert("Please Fill User Password")
        }
      }
      else {
        alert("Please Fill User Name")
      }
    }
    else {
      alert("Please Fill Company Name")
    }

  }

  render() {
    const secure = this.state.secure_password_entry;
    const eye = (
      <TextInput.Icon
        icon={secure ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => { this.onText1Press() }}
      />
    );

    return (
      <View style={styles.container}>
        <MyHeader
          title={'New Company'}
          rightIcon={'home'}
          backGroundColor={colors.primary}
          go={() => {
            Alert.alert('Creating Company', 'Are you sure to Cancel ',
              [{ text: 'NO', onPress: () => { }, style: 'cancel' },
              { text: 'Yes', onPress: () => this.handelExit() }], { cancelable: true })
          }}
        />

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>Register your business</Text>
          <Text style={styles.pageSubtitle}>
            This creates a separate database for the company. Nothing is shared with
            any other company on this device.
          </Text>

          <Text style={styles.sectionLabel}>BASIC DETAILS</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              underlineColor={colors.border}
              activeUnderlineColor={colors.primary}
              label="Company name"
              value={this.state.ComapanyName}
              returnKeyType="next" blurOnSubmit={false}
              onSubmitEditing={() => this.usernameref.focus()}
              left={<TextInput.Icon icon="storefront-outline" />}
              onChangeText={this.setcompanyname} />

            <TextInput
              style={styles.input}
              underlineColor={colors.border}
              activeUnderlineColor={colors.primary}
              label="Username"
              autoCapitalize="none"
              value={this.state.user_name}
              ref={ref => this.usernameref = ref}
              returnKeyType="next" blurOnSubmit={false}
              onSubmitEditing={() => this.passwordref.focus()}
              left={<TextInput.Icon icon="account-outline" />}
              onChangeText={this.set_user_name} />

            <TextInput
              style={styles.input}
              underlineColor={colors.border}
              activeUnderlineColor={colors.primary}
              label="Password"
              autoCapitalize="none"
              value={this.state.user_password}
              ref={ref => this.passwordref = ref}
              secureTextEntry={secure}
              returnKeyType="next" blurOnSubmit={false}
              onSubmitEditing={() => this.retypepasswordref.focus()}
              left={<TextInput.Icon icon="lock-outline" />}
              right={eye}
              onChangeText={this.set_user_password} />

            <TextInput
              style={styles.input}
              underlineColor={colors.border}
              activeUnderlineColor={colors.primary}
              label="Confirm password"
              autoCapitalize="none"
              value={this.state.user_retype_password}
              ref={ref => this.retypepasswordref = ref}
              secureTextEntry={secure}
              returnKeyType="done"
              left={<TextInput.Icon icon="lock-check-outline" />}
              right={eye}
              onChangeText={this.set_user_re_type_password} />

            <Text style={styles.hint}>Use at least 8 characters.</Text>
          </View>

          <Text style={styles.sectionLabel}>PASSWORD RECOVERY</Text>
          <View style={styles.card}>
            <Text style={styles.cardHint}>
              These answers are the only way to recover access if the password is
              forgotten.
            </Text>

            <TextInput
              style={styles.input}
              underlineColor={colors.border}
              activeUnderlineColor={colors.primary}
              label="Favourite colour"
              value={this.state.FavouriteColor}
              returnKeyType="next" blurOnSubmit={false}
              onSubmitEditing={() => this.FvCity.focus()}
              onChangeText={(text) => { this.setState({ FavouriteColor: text }) }} />

            <TextInput
              style={styles.input}
              underlineColor={colors.border}
              activeUnderlineColor={colors.primary}
              label="Favourite city"
              value={this.state.FavouriteCity}
              ref={ref => this.FvCity = ref}
              returnKeyType="next" blurOnSubmit={false}
              onSubmitEditing={() => this.FvPerson.focus()}
              onChangeText={(text) => { this.setState({ FavouriteCity: text }) }} />

            <TextInput
              style={styles.input}
              underlineColor={colors.border}
              activeUnderlineColor={colors.primary}
              label="Favourite person"
              value={this.state.FavouritePerson}
              ref={ref => this.FvPerson = ref}
              returnKeyType="done"
              onChangeText={(text) => { this.setState({ FavouritePerson: text }) }} />
          </View>

          <Text style={styles.sectionLabel}>FINANCIAL YEAR</Text>
          <View style={styles.card}>
            <Text style={styles.cardHint}>Start date for this company's books.</Text>
            <DatePicker
              style={styles.datePicker}
              date={this.state.finacial_year_starting_date}
              mode="date"
              placeholder="select date"
              format="DD-MMM-YYYY"
              minDate="2000-05-01"
              maxDate="2050-12-30"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => { this.setState({ finacial_year_starting_date: date, isView2Visible: true }) }}
            />
          </View>

          <TouchableOpacity style={styles.buttonStyle} onPress={this.create} activeOpacity={0.85}>
            <Text style={styles.buttonTextStyle}>CREATE COMPANY</Text>
          </TouchableOpacity>
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
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: colors.textMuted,
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    marginHorizontal: 4,
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
    marginHorizontal: 4,
  },
  input: {
    backgroundColor: colors.surface,
    width: '100%',
  },
  datePicker: {
    width: '100%',
    marginTop: 4,
    marginBottom: 4,
  },
  buttonStyle: {
    marginTop: 28,
    backgroundColor: colors.primary,
    height: 52,
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonTextStyle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
    textAlign: 'center',
    color: colors.onPrimary,
  },
});
