import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Button, TextInput, BackHandler, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyHeader from '../components/Header';
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwsome from 'react-native-vector-icons/dist/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FloatingAction } from "../components/FloatingAction";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';


export default class Inventory_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      FlatListItems: [],
      FlateListSearchItem: [],
      ItemDetails: [],
      Supplier: "",
      Unit: "",
      Category: "",
      SearchCustomerName: null,

      NoDataFoundView: false,


      VisibleSearch: true,
      DetailView: false,
      SearchInputVisible: false,
      show: true,


      itemName: null,
      itemDescription: null,
      itemCode: null,
      itemBarCode: null,
      perUnitBuyingCost: null,
      perUnitSellingCost: null,
      itemCurrentstock: 0,
      itemMinimumStock: 0,
      assOfDate: null,

      isfooterVisible: true,
    }
    this.getItems();
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {

      if (this.state.DetailView) {
        this.setState({ show: true });
        this.setState({ DetailView: false });

      } else {
        this.props.navigation.navigate('HOME_SCREEN')
      }
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
      this.setState({ SearchInputVisible: true });

    } else {
      this.setState({ show: true });
      this.setState({ SearchInputVisible: false });

    }
  };

  getMinStockItem = () => {
    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        // alert(this.state.ComapanyName);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM InventoryItems where CurrentStock+0 < MinimumStock+0 ORDER BY ItemName', [], (tx, results) => {
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
          tx.executeSql('SELECT * FROM InventoryItems where IsActive =1 ORDER BY ItemName', [], (tx, results) => {
            var temp = [];
            if (results.rows.length > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              this.setState({
                FlatListItems: temp,
              });
            }
            else {
              this.setState({ NoDataFoundView: true })
            }
          });
        });
      }
    });
  }

  Search = (text) => {
    this.setState({ SearchCustomerName: text })


    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        // alert(this.state.ComapanyName);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });
        var temp = '%' + this.state.SearchCustomerName + '%';

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM InventoryItems where ItemName LIKE ? AND IsActive =1', [temp], (tx, results) => {

            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            this.setState({
              FlateListSearchItem: temp,
            });
          });
        });

      }

    });
  }




  details = (item) => {

    this.setState({ show: false });
    this.setState({ DetailView: true });

    this.state.itemName = item.ItemName;
    this.state.itemDescription = item.ItemDescription;
    this.state.itemCode = item.ItemCode;
    this.state.itemBarCode = item.ItemBarcode;
    this.state.perUnitBuyingCost = item.PerUnitCostPrice;
    this.state.perUnitSellingCost = item.PerUnitSellprice;
    this.state.itemCurrentstock = item.CurrentStock;
    this.state.itemMinimumStock = item.MinimumStock;

    this.state.assOfDate = item.AsOFDate;



    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM UnitOfMeasure where IsActive =1 AND UnitID=?',
            [item.UnitID], (tx, results) => {
              var len = results.rows.length;
              console.log('len', len);
              if (len > 0) {
                this.setState({
                  Unit: results.rows.item(0),
                });
              }
            });
        });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Suppliers where IsActive =1 And SupplierID=?',
            [item.SupplierID], (tx, results) => {
              var len = results.rows.length;
              console.log('len', len);
              if (len > 0) {
                this.setState({
                  Supplier: results.rows.item(0),
                });
              }
            });
        });
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM ItemCategory where IsActive =1 AND ItemCategoryID=?',
            [item.ItemCategoryID], (tx, results) => {
              var len = results.rows.length;
              console.log('len', len);
              if (len > 0) {
                this.setState({
                  Category: results.rows.item(0),
                });
              }
            });
        });


      }

    });



  }

  render() {
    return (


      <View style={styles.container}>

        {this.state.NoDataFoundView ?

          <MyHeader
            title={"INVENTORY"}
            go={this.ShowHideComponent}
            backGroundColor={colors.primary}
          /> :
          <MyHeader
            title={"INVENTORY"}
            rightIcon={"search"}
            go={this.ShowHideComponent}
            backGroundColor={colors.primary}
          />}

        {/* //////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////// */}

{this.state.NoDataFoundView ?
          <View
            style={{
              marginTop: '50%'
            }}>
            <Text style={{ color: colors.textSecondary, fontSize: 20, textAlign: "center" }}>No Items Found</Text>

            <Text style={{ color: colors.textSecondary, fontSize: 20, textAlign: "center" }}>Inventory is Empty</Text>

            <MaterialCommunityIcons
              onPress={() => this.props.navigation.navigate('ADD_INVENTORY_ITEM_SCREEN')}
              style={{ alignSelf: "center", marginTop: 24 }} name="plus-circle" size={72} color={colors.primary} />

          </View>
          :
        null
        }



        {this.state.DetailView ?
          <View style={styles.upperView} >

            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center", backgroundColor: colors.primaryLight }}>
              <Text style={{ fontSize: 28, color: colors.textOnDark, marginLeft: 20 }}>{this.state.itemName}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", marginTop: 12 }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>Code             :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.itemCode}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>BarCode       :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.itemBarCode}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>Description  :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.itemDescription}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>Unit Cost      :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.perUnitBuyingCost}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>Unit Sell        :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.perUnitSellingCost}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>Stock            :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.itemCurrentstock}</Text>
            </View><View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>Minimum Stock            :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.itemMinimumStock}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>Last Use       :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 20 }}>{this.state.assOfDate}</Text>
            </View>


            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>UNIT              :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 65 }}>{this.state.Unit.UnitName}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>CATEGORY       :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.Category.ItemCategoryName}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 20 }}>SUPPLIER       :   </Text>
              <Text style={{ fontSize: 20, color: colors.textOnDark, marginRight: 100 }}>{this.state.Supplier.SupplierName}</Text>
            </View>

          </View>
          : null
        }

        {/* //////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////// */}
        {this.state.show ? (
          <FlatList style={styles.flatelistStyle}
            data={this.state.FlatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View key={item.ItemID} style={styles.flatelistViewStyle}>
                <TouchableOpacity style={styles.buttonStyle} onLongPress={() => { this.details(item) }}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "45%", justifyContent: "center", backgroundColor: colors.primary }}>
                      <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>{item.ItemName}</Text>
                      <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: '10%' }}>Stock  :  {item.CurrentStock}</Text>
                    </View>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: colors.primaryLight, width: '55%' }}>
                      <Text style={{ fontSize: 16, color: colors.textOnDark }}>Cost Price :  {item.PerUnitCostPrice}</Text>
                      <Text style={{ fontSize: 16, color: colors.textOnDark }}>  Sell Price   :  {item.PerUnitSellprice}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        ) :
          null
        }
        {this.state.SearchInputVisible ?
          <TextInput autoFocus={true} style={styles.SearchTextInput} placeholder=" Item Name" onChangeText={this.Search} />
          : null
        }
        {this.state.show ? (
          null
        ) :
          <FlatList style={styles.flatelistStyle}
            data={this.state.FlateListSearchItem}

            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View key={item.ItemID} style={styles.flatelistViewStyle}>
                <TouchableOpacity style={styles.buttonStyle}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "35%", justifyContent: "center", backgroundColor: colors.primary }}>
                      <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>{item.ItemName}</Text>
                      <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: '10%' }}>Stock  :  {item.CurrentStock}</Text>
                    </View>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: colors.primaryLight, width: '65%' }}>
                      <Text style={{ fontSize: 16, color: colors.textOnDark }}>Cost Price :  {item.PerUnitCostPrice}</Text>
                      <Text style={{ fontSize: 16, color: colors.textOnDark }}>Sell Price   :  {item.PerUnitSellprice}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

            )}
          />

        }




{this.state.NoDataFoundView ?
null:
this.state.isfooterVisible ?

          <View style={styles.Footer}>
            <TouchableOpacity style={styles.footerTouchableOpcity}
              onPress={() => {
                this.getMinStockItem()
                this.setState({ isfooterVisible: false })
              }}
            >
              <View style={styles.FooterView} >
                <MaterialCommunityIcons name="animation" size={28} color={colors.accent} />
                <Text style={{ color: colors.accent, marginBottom: 32 }}>Items Stock Minimum Limit Crossed </Text>
              </View>
            </TouchableOpacity>
          </View> :
          <View style={styles.Footer}>
            <TouchableOpacity style={styles.footerTouchableOpcity}
              onPress={() => {
                this.setState({ isfooterVisible: true })
                this.getItems()
              }}
            >
              <View style={styles.FooterView} >
                <MaterialCommunityIcons name="animation-outline" size={28} color={colors.accent} />
                <Text style={{ color: colors.accent, marginBottom: 32 }}>All Items</Text>
              </View>
            </TouchableOpacity>
          </View>}

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
  SearchTextInput: {
    textAlign: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    width: wp('90%'),
    fontSize: hp('2.5%'),
  },

  upperView: {
    height: 400,
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
  Footer: {
    height: 45,
    width: "100%",
    backgroundColor: colors.textOnDark,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 0,
  },
  footerTouchableOpcity: {
    width: "100%"
  },
  FooterView: {
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
});
