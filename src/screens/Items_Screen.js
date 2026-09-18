

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Button, TextInput, BackHandler, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyHeader from '../components/Header';
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwsome from 'react-native-vector-icons/dist/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FloatingAction } from "../components/FloatingAction";
import Overlay from '../components/Overlay';
import { colors, spacing, radius, typography } from '../theme';
import { TableHeader, TableRow, EmptyState, DetailRow } from '../components/ui';


export default class Items_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      FlatListItems: [],
      FlateListSearchItem: [],
      SearchCustomerName: null,
      VisibleSearch: true,
      NoDataFoundView: false,

      show: true,
      isvisbleOverlay: false,


      itemName: null,
      itemDescription: null,
      itemCode: null,
      itemBarCode: null,
      perUnitBuyingCost: null,
      perUnitSellingCost: null,
      itemCurrentstock: null,
      itemMinimumStock: null,
      assOfDate: null,


      selectedUnit: null,
      selectedSupplier: null,
      selectedItemCategory: null,

    }


    this.getItems();




  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };


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
          tx.executeSql('SELECT * FROM InventoryItems where ItemName LIKE ? AND IsActive =1 ORDER BY ItemName', [temp], (tx, results) => {

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


  getItemDetails = (item) => {

    this.state.itemName = item.ItemName;
    this.state.itemCode = item.ItemCode;
    this.state.itemBarCode = item.ItemBarcode;
    this.state.itemDescription = item.ItemDescription;
    this.state.perUnitBuyingCost = item.PerUnitCostPrice;
    this.state.perUnitSellingCost = item.PerUnitSellprice;
    this.state.itemCurrentstock = item.CurrentStock;
    this.state.itemMinimumStock = item.MinimumStock;
    this.setState({ isvisbleOverlay: true })
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate('HOME_SCREEN')
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }


  render() {
    const { show, NoDataFoundView } = this.state;
    const rows = show ? this.state.FlatListItems : this.state.FlateListSearchItem;

    return (
      <View style={styles.container}>
        <MyHeader
          title={'ITEMS'}
          rightIcon={NoDataFoundView ? undefined : 'search'}
          go={this.ShowHideComponent}
          backGroundColor={colors.primary}
        />

        {show ? null : (
          <View style={styles.searchWrap}>
            <TextInput
              autoFocus={true}
              style={styles.search}
              placeholder="Search item name"
              placeholderTextColor={colors.textMuted}
              onChangeText={this.Search}
            />
          </View>
        )}

        {NoDataFoundView ? (
          <EmptyState
            icon="package-variant"
            title="No items yet"
            message="Add items to build your inventory."
            actionLabel="Add item"
            onAction={() => this.props.navigation.navigate('ADD_INVENTORY_ITEM_SCREEN')}
          />
        ) : (
          <View style={styles.listWrap}>
            <TableHeader columns={[{ title: 'ID', width: '20%', align: 'center' }, { title: 'ITEM NAME', width: '50%' }, { title: 'STOCK', width: '30%', align: 'center' }]} />
            <FlatList
              data={rows}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <TableRow
                  index={index}
                  onPress={() => this.getItemDetails(item)}
                  onLongPress={() => this.props.navigation.navigate("EDIT_INVENTORY_ITEM_SCREEN",
                      {
                        itemid: item.ItemID, itemname: item.ItemName, itemdisp: item.ItemDescription, itemcode: item.ItemCode, itembarcode: item.ItemBarcode,
                        itempuc: item.PerUnitCostPrice, itempus: item.PerUnitSellprice, itemstock: item.CurrentStock, itemminstock: item.MinimumStock, itemasofdate: item.AsOFDate,
                        uid: item.UnitID, cid: item.ItemCategoryID, sid: item.SupplierID,
                      })}
                  cells={[{ text: String(item.ItemID), width: '20%', align: 'center' }, { text: String(item.ItemName), width: '50%', strong: true }, { text: String(item.CurrentStock), width: '30%', align: 'center' }]}
                />
              )}
            />
          </View>
        )}

        {NoDataFoundView ? null : (
          <FloatingAction
            color={colors.primary}
            onPressMain={() => this.props.navigation.navigate('ADD_INVENTORY_ITEM_SCREEN')}
          />
        )}

        <Overlay
          isVisible={this.state.isvisbleOverlay}
          onBackdropPress={() => this.setState({ isvisbleOverlay: false })}
          width="86%">
          <Text style={styles.overlayTitle}>Item details</Text>
          <DetailRow label="Name" value={this.state.itemName} />
          <DetailRow label="Description" value={this.state.itemDescription} />
          <DetailRow label="Code" value={this.state.itemCode} />
          <DetailRow label="Barcode" value={this.state.itemBarCode} />
          <DetailRow label="Cost price" value={this.state.perUnitBuyingCost} />
          <DetailRow label="Sell price" value={this.state.perUnitSellingCost} />
          <DetailRow label="In stock" value={this.state.itemCurrentstock} />
          <DetailRow label="Minimum stock" value={this.state.itemMinimumStock} last />
        </Overlay>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listWrap: { flex: 1 },
  searchWrap: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  search: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  overlayTitle: { ...typography.subtitle, marginBottom: spacing.sm },
});
