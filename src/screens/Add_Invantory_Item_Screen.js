import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MyHeader from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwsome5 from 'react-native-vector-icons/dist/FontAwesome5';
import DatePicker from '../components/DatePicker';
import { colors } from '../theme';

export default class Add_Inventory_Item_Screen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      CompanyName: null,

      unitname: [],
      suppliersname: [],
      itemCategory: [],


      itemName: null,
      itemDescription: null,
      itemCode: null,
      itemBarCode: null,
      perUnitBuyingCost: null,
      perUnitSellingCost: null,
      itemCurrentstock: 0,
      itemMinimumStock: 0,
      assOfDate: null,


      selectedUnit: null,
      selectedSupplier: null,
      selectedItemCategory: null,
      isVisibleView1: false,
      isVisibleView2: false,
      istext1Visble: true,
      istext2Visble: true,



    }
    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
      if (result !== null) {
        var abc = result;
        this.setState({ CompanyName: abc });
      }

    });
    this.getPickerValues();
  }

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
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds

    that.setState({
      //Setting the value of the date time
      assOfDate:
        date + '-' + month + '-' + year,
    })
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => this.props.navigation.navigate("ITEMS_SCREEN"))
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  getPickerValues = () => {

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ CompanyName: abc });
        // alert(this.state.);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM UnitOfMeasure where IsActive =1', [], (tx, results) => {
            var temp = [];
            if(results.rows.length>0)
            {

            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            this.setState({
              unitname: temp,
            });
          
                        ////////////////////////////////getting Suplliers//////////////////
                        db.transaction(tx => {
                          tx.executeSql('SELECT * FROM Suppliers where IsActive =1', [], (tx, results) => {
                            var temp = [];
                            if(results.rows.length>0)
                            {
                            for (let i = 0; i < results.rows.length; ++i) {
                              temp.push(results.rows.item(i));
                            }
                            this.setState({
                              suppliersname: temp,
                            });
                            //////////////////////////////geting categoryies/////////
                            db.transaction(tx => {
                              tx.executeSql('SELECT * FROM ItemCategory where IsActive =1', [], (tx, results) => {
                                var temp = [];
                                if(results.rows.length>0)
                                {
                                for (let i = 0; i < results.rows.length; ++i) {
                                  temp.push(results.rows.item(i));
                                }
                                this.setState({
                                  itemCategory: temp,
                                });
                              }else
                              {
                                
                                Alert.alert(
                                  'No Item Category Found',
                                  'Please Add A Category To Identify Items Type',
                                  [
                                      {
                                          text: 'Ok',
                                          onPress: () =>
                                              this.props.navigation.navigate('ADD_ITEM_CATEGORY'),
                                      },
                                  ],
                                  { cancelable: false }
                              );
                    
                    
                          
                              
                              }
                              });
                            });
                    
                          }
                          else{
                            
                            
                            
                            Alert.alert(
                              'No Supplier Found',
                              'Please Add A Supplier Which You Sale Items',
                              [
                                  {
                                      text: 'Ok',
                                      onPress: () =>
                                          this.props.navigation.navigate('ADD_SUPPLIER_SCREEN'),
                                  },
                              ],
                              { cancelable: false }
                          );
                
                
                      
                          }
                          });
                        });
          
                        //////////////////////getting supplier finish///////////////////
          
          }
            else{
              Alert.alert(
                'No Unit Found',
                'Please Add A Unit To Identify Its Properties',
                [
                    {
                        text: 'Ok',
                        onPress: () =>
                            this.props.navigation.navigate('ADD_INVENTORY_UNIT_SCREEN'),
                    },
                ],
                { cancelable: false }
            );


        
            }
          });
        });

        


       

        // db.transaction(tx => {
        //   tx.executeSql('SELECT * FROM ItemSubCategory where IsActive =1', [], (tx, results) => {
        //     var temp = [];
        //     for (let i = 0; i < results.rows.length; ++i) {
        //       temp.push(results.rows.item(i));
        //     }
        //     this.setState({
        //       ItemSubCategory: temp,
        //     });
        //   });
        // });


      }

    });
  }

  Unitlist = () => {
    return (this.state.unitname.map((x, i) => {
      return (<Picker.Item label={x.UnitName} key={i} value={x} />)
    }));
  }

  Supplierslist = () => {

    return (this.state.suppliersname.map((x, i) => {
      return (<Picker.Item label={x.SupplierName} key={i} value={x} />)
    }));
  }

  ItemCategorylist = () => {
    return (this.state.itemCategory.map((x, i) => {
      return (<Picker.Item label={x.ItemCategoryName} key={i} value={x} />)
    }));
  }



  InsertItemName = () => {

    var that = this;
    const { CompanyName } = this.state;
    const { itemName } = this.state;
    const { itemDescription } = this.state;
    const { itemCode } = this.state;
    const { itemBarCode } = this.state;
    const { selectedUnit } = this.state;
    const { selectedSupplier } = this.state;
    const { selectedItemCategory } = this.state;
    const { perUnitBuyingCost } = this.state;
    const { perUnitSellingCost } = this.state;
    const { itemCurrentstock } = this.state;
    const { itemMinimumStock } = this.state;
    const { assOfDate } = this.state;
    // alert(itemName + "   " + itemDescription + "   " + itemCode + "  " + itemBarCode + "  " + selectedUnit.UnitID + "  " + db_name)
    // alert(selectedItemCategory.ItemCategoryID+"  "+selectedSupplier.SupplierID+"  "+selectedUnit.UnitID)
    // alert(perUnitBuyingCost+"  "+perUnitSellingCost+"  "+itemCurrentstock+"  "+assOfDate);



    if (itemName != null) {
      if (selectedSupplier != null) {
        if (selectedUnit != null) {
          if (selectedItemCategory != null) {
            if (perUnitBuyingCost != null) {
              if (perUnitSellingCost != null) {

                if (assOfDate != null) {

                  ///////////////////////////////////////////////////////////////////
                  var db_name = CompanyName + ".db";
                  db_name = db_name.replace(/\s/g, '');
                  var db = openDatabase({ name: db_name });
                  db.transaction(function (txn) {
                    // txn.executeSql('CREATE TABLE IF NOT EXISTS InventoryItems(ItemID INTEGER PRIMARY KEY AUTOINCREMENT, ItemName VARCHAR(20) NOT NULL, ItemDescription VARCHAR(100), ItemCode VARCHAR(30), ItemBarcode VARCHAR(30), UnitID INTEGER, ItemCategoryID INTEGER, SupplierID INTEGER,  PerUnitCostPrice VARCHAR(10) NOT NULL, PerUnitSellprice VARCHAR(10) NOT NULL, CurrentStock INTEGER NOT NULL, AsOFDate VARCHAR(30), IsActive INTEGER DEFAULT 1 )', []);
                    txn.executeSql('INSERT INTO  InventoryItems( ItemName, ItemDescription, ItemCode, ItemBarcode, UnitID, ItemCategoryID , SupplierID,  PerUnitCostPrice, PerUnitSellprice, CurrentStock, MinimumStock, AsOFDate ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemName, itemDescription, itemCode, itemBarCode, selectedUnit.UnitID, selectedItemCategory.ItemCategoryID, selectedSupplier.SupplierID, perUnitBuyingCost, perUnitSellingCost, itemCurrentstock, itemMinimumStock, assOfDate],
                      (txn, results) => {
                        console.log('Results  new ', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                          Alert.alert(
                            'Success',
                            'Item Save Successfully',
                            [
                              {
                                text: 'Ok',
                                onPress: () =>
                                  that.props.navigation.navigate('ITEMS_SCREEN'),
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

                  /////////////////////////////////////////////////////////////

                }
                else {
                  alert("Please select Date")
                }

              }
              else {
                alert("Please Enter PerUnitSelling Cost")
              }
            }
            else {
              alert("Please Enter PerUnitBuying Cost")
            }
          }
          else {
            alert("Please Select Item Category")
          }
        }
        else {
          alert("please Select Unit")
        }
      }
      else {
        alert("please Select Supplier")
      }
    }
    else {
      alert("Please Fill Item Name")

    }


  }



  onText1Press = () => {

    this.setState({ isVisibleView1: !this.state.isVisibleView1 })
  }
  onText2Press = () => {


    this.setState({ isVisibleView2: !this.state.isVisibleView2})

  }

  render() {
    return (

      <View style={styles.container}>

        <MyHeader

          title={"ADD ITEM"}
          rightIcon={"save"}
          backGroundColor={colors.primary}
          go={this.InsertItemName}
        // go={() => this.props.navigation.navigate('INVENTORY')}
        />
        {/* // txn.executeSql('CREATE TABLE IF NOT EXISTS InventoryItems(ItemID INTEGER PRIMARY KEY AUTOINCREMENT, ItemName VARCHAR(20) NOT NULL, ItemDescription VARCHAR(100), ItemCode VARCHAR(30), Barcode VARCHAR(30), PerUnitCostPrice VARCHAR(10) NOT NULL, PerUnitSellprice VARCHAR(10) NOT NULL, CurrentStock INTEGER NOT NULL, AsOFDate VARCHAR(30), UnitID INTEGER,I temCategoryID INTEGER, ItemSubCategoryID INTEGER, SupplierID INTEGER, IsActive INTEGER DEFAULT 1 )', []); */}
        <ScrollView >
          <View style={{ marginBottom: 50 }}>


            {/* /////////////////////////////////////VIEW 1 BASCI DETAILS//////////////////////////////////// */}

            <View style={styles.view1}>
              <Text style={styles.textstyle}>Item Name</Text>
              <TextInput style={styles.textInputStyle} placeholder="Item Name"
                returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.ItemDisp.focus()}
                onChangeText={(text) => { this.setState({ itemName: text }) }}
              />

              <Text style={styles.textstyle}>Item Description</Text>
              <TextInput style={styles.textInputStyle} placeholder="Item Description"
                ref={ref => this.ItemDisp = ref}
                returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.ItemCode.focus()}
                onChangeText={(text) => { this.setState({ itemDescription: text }) }}
              />
              <Text style={styles.textstyle}>Item Code</Text>
              <TextInput style={styles.textInputStyle} placeholder="Item Code"
                ref={ref => this.ItemCode = ref}
                returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.itembarcode.focus()}
                onChangeText={(text) => { this.setState({ itemCode: text }) }}
              />

              <Text style={styles.textstyle}>Item Barcode</Text>
              <TextInput style={styles.textInputStyle} placeholder="Item Barcode" ref={ref => this.itembarcode = ref}
                keyboardType="number-pad"
                onChangeText={(text) => { this.setState({ itemBarCode: text }) }}
              />
            </View>


            {/* /////////////////////////////////////VIEW 2 ITEM TYPE DETAIL//////////////////////////////////// */}


            {this.state.istext1Visble ?
              <TouchableOpacity onPress={() => { this.onText1Press() }}>
                <Text style={{ fontSize: 14, color: 'gray', margin: 12, }}> + ADD ITEM PROPERTIES</Text>
              </TouchableOpacity>
              : null}
            {this.state.isVisibleView1 ?
              <View style={styles.view1}>

                <Text style={styles.textstyle}>Supplier</Text>
                <Picker
                  selectedValue={this.state.selectedSupplier}
                  style={styles.pickerStyle}
                  onValueChange={(value) => {
                    (this.setState({ selectedSupplier: value }))

                  }}

                >
                  <Picker.Item label='select a Supplier' value='0' />
                  {this.Supplierslist()}

                </Picker>

                <Text style={styles.textstyle}>Unit</Text>
                <Picker
                  selectedValue={this.state.selectedUnit}
                  style={styles.pickerStyle}
                  onValueChange={(value) => (this.setState({ selectedUnit: value }))}>
                  <Picker.Item label='select an Unit' value='0' />
                  {this.Unitlist()}
                </Picker>

                <Text style={styles.textstyle}>Item Category</Text>
                <Picker
                  selectedValue={this.state.selectedItemCategory}

                  style={styles.pickerStyle}

                  onValueChange={(value) => (
                    this.setState({ selectedItemCategory: value }))}>
                  <Picker.Item label='select an Item Category' value='0' />
                  {this.ItemCategorylist()}
                </Picker>
              </View>
              : null}

            {/* /////////////////////////////////////VIEW 3 PRICE AND STOCK DETAIL//////////////////////////////////// */}

            {this.state.istext2Visble ?
              <TouchableOpacity onPress={() => { this.onText2Press() }}>
                <Text style={{ fontSize: 14, color: 'gray', margin: 12, }}> + ADD PRICING DETAILS/STOCK</Text>
              </TouchableOpacity>
              : null}
            {this.state.isVisibleView2 ?
              <View style={styles.view1}>
                <Text style={styles.textstyle}>Perunit Buying Cost </Text>
                <TextInput style={styles.textInputStyle} placeholder="Perunit Buying Cost" keyboardType="number-pad"
                  returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.itemsellcost.focus()}
                  onChangeText={(text) => { this.setState({ perUnitBuyingCost: text }) }}
                />

                <Text style={styles.textstyle}>Perunit Selling Cost </Text>
                <TextInput style={styles.textInputStyle} placeholder="Perunit Selling Cost" keyboardType="number-pad"
                  ref={ref => this.itemsellcost = ref}
                  returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.itemstock.focus()}
                  onChangeText={(text) => { this.setState({ perUnitSellingCost: text }) }}
                />

                <Text style={styles.textstyle}>Current Stock</Text>
                <TextInput style={styles.textInputStyle} placeholder="Current Stock / Items you have"
                  keyboardType="number-pad" ref={ref => this.itemstock = ref}
                  blurOnSubmit={false} onSubmitEditing={() => this.itemMinstock.focus()}
                  returnKeyType="next"
                  onChangeText={(text) => { this.setState({ itemCurrentstock: text }) }}
                />

                <Text style={styles.textstyle}>Minimum Stock</Text>
                <TextInput style={styles.textInputStyle} placeholder="Stock you should have"
                  keyboardType="number-pad" ref={ref => this.itemMinstock = ref}
                  onChangeText={(text) => { this.setState({ itemMinimumStock: text }) }}
                />

                <Text style={styles.textstyle}>As Of Date</Text>
                <DatePicker
                  style={{ width: '95%', marginBottom: 20, marginTop: 20, alignItems: "center" }}
                  date={this.state.assOfDate}
                  mode="date"
                  placeholder="select date"
                  format="DD-MMM-YYYY"
                  minDate="2000-05-01"
                  maxDate="2050-12-30"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ assOfDate: date }) }}
                />
              </View> : null}
          </View>

        </ScrollView>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textstyle: {
    marginLeft: 12, paddingTop: 12,

  },
  textInputStyle: {
    borderBottomWidth: 1, borderColor: colors.primary, width: ('95%'), marginLeft: 12, height: 40, marginBottom: 12,
    fontSize: 18,
  },
  pickerStyle: {
    height: 50, width: ('95%'), marginLeft: 12, marginBottom: 8, color: colors.primary
  },
  Footer: {
    height: 45,
    width: "100%",
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 0,
  },
  footerTouchableOpcity: {
    width: "50%"
  },
  FooterView: {
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
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
  //  icon:{
  //    marginRight: 20,
  //     justifyContent: 'flex-start',
  //     alignItems: 'flex-end',
  //  }

});
