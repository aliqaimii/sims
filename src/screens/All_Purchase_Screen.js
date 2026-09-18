import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Button, TextInput, BackHandler, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyHeader from '../components/Header';
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwsome from 'react-native-vector-icons/dist/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FloatingAction } from "../components/FloatingAction";
import { colors, spacing, radius, typography } from '../theme';
import { TableHeader, TableRow, EmptyState } from '../components/ui';


export default class All_Purchase_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      TransectionType: "",
      headerTitle: "All PURCHASE",
      backgroundColor: colors.danger,
      FlatListItems: [],
      FlateListSearchItem: [],
      SearchSupplierName: null,
      VisibleSearch: true,
      show: true,
      NoDataFoundView: false,


    }
    const { navigation } = this.props;
    const TRANCATIONSTYPE = navigation.getParam('transType', null);
    this.state.TransectionType = TRANCATIONSTYPE;


    if (this.state.TransectionType == "oncash" || this.state.TransectionType == "onloan") {

      this.getItemsbyTransectionType();

    }

    else {
      this.getItems();
    }





  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };


  getItemsbyTransectionType = () => {

    var tempTransectionType;

    if (this.state.TransectionType == "oncash") {
      tempTransectionType = 1;
      this.state.headerTitle = "TRANSECTONS ON CASH"
    }
    if (this.state.TransectionType == "onloan") {
      tempTransectionType = 0;
      this.state.headerTitle = "TRANSECTONS ON LOAN"
    }

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        // alert(this.state.ComapanyName);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM  Invoices where IsActive =1  AND OnCash = ? ORDER BY PurchaseID DESC',
            [tempTransectionType], (tx, results) => {
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


          tx.executeSql('SELECT * FROM  Purchase where IsActive =1  ORDER BY PurchaseID DESC', [], (tx, results) => {
            // tx.executeSql('SELECT PurchaseID,Date,TotalAmmount,SupplierName FROM  Invoices  Left Join Customers on Invoices.CustomerID =Customers.CustomerID  where IsActive =1  ORDER BY PurchaseID DESC', [], (tx, results) => {     
            var temp = [];

            // if(results.rows.length>0)
            // {
            //   console.log(results.rows.item(1))
            // }
            // else
            // {
            //   alert("cant")
            // }
            if (results.rows.length > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              this.setState({
                FlatListItems: temp,
              });
            } else {
              this.setState({ NoDataFoundView: true })
            }
          });
        });

      }

    });
  }

  Search = (text) => {

    this.setState({ SearchSupplierName: text })

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        // alert(this.state.ComapanyName);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });
        var temp = '%' + this.state.SearchSupplierName + '%';

        if (this.state.TransectionType == "oncash" || this.state.TransectionType == "onloan") {

          var tempTransectionType;

          if (this.state.TransectionType == "oncash") {
            tempTransectionType = 1;

          }
          if (this.state.TransectionType == "onloan") {
            tempTransectionType = 0;

          }

          db.transaction(tx => {
            tx.executeSql('SELECT * FROM Purchase where (Date LIKE ? OR TotalAmmount LIKE ? OR SupplierName LIKE ?) AND OnCash = ? ', [temp, temp, temp, tempTransectionType], (tx, results) => {

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

        else {

          db.transaction(tx => {
            tx.executeSql('SELECT * FROM Purchase where (Date LIKE ? OR TotalAmmount LIKE ? OR SupplierName LIKE ?) AND IsActive =1 ', [temp, temp, temp], (tx, results) => {

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


      }

    });
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
          title={'ALL PURCHASES'}
          rightIcon={NoDataFoundView ? undefined : 'search'}
          go={this.ShowHideComponent}
          backGroundColor={colors.primary}
        />

        {show ? null : (
          <View style={styles.searchWrap}>
            <TextInput
              autoFocus={true}
              style={styles.search}
              placeholder="Search supplier name"
              placeholderTextColor={colors.textMuted}
              onChangeText={this.Search}
            />
          </View>
        )}

        {NoDataFoundView ? (
          <EmptyState
            icon="cart-outline"
            title="No purchases yet"
            message="Recorded purchases will appear here."
            actionLabel="Record a purchase"
            onAction={() => this.props.navigation.navigate('PURCHASE_SCREEN')}
          />
        ) : (
          <View style={styles.listWrap}>
            <TableHeader columns={[{ title: 'INV', width: '20%', align: 'center' }, { title: 'SUPPLIER', width: '50%' }, { title: 'AMOUNT', width: '30%', align: 'center' }]} />
            <FlatList
              data={rows}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <TableRow
                  index={index}
                  onPress={() => { this.props.navigation.navigate('PURCHASE_DETAILS_SCREEN', { invid: item.PurchaseID, transType: this.state.TransectionType }) }}
                  cells={[{ text: String(item.PurchaseID), width: '20%', align: 'center' }, { text: String(item.SupplierName), width: '50%', strong: true }, { text: String(item.TotalAmmount), width: '30%', align: 'center' }]}
                />
              )}
            />
          </View>
        )}

        {NoDataFoundView ? null : (
          <FloatingAction
            color={colors.primary}
            onPressMain={() => this.props.navigation.navigate('PURCHASE_SCREEN')}
          />
        )}

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
