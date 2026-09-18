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


export default class All_Sell_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      TransectionType: "",
      headerTitle: "All SALES",
      backgroundColor: colors.danger,

      NoDataFoundView: false,

      FlatListItems: [],
      FlateListSearchItem: [],
      SearchCustomerName: null,
      VisibleSearch: true,
      show: true,

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
      this.state.headerTitle = "SALES ON CASH"
    }
    if (this.state.TransectionType == "onloan") {
      tempTransectionType = 0;
      this.state.headerTitle = "SALES ON LOAN"
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
          tx.executeSql('SELECT * FROM  Invoices where IsActive =1  AND OnCash = ? ORDER BY InvoiceID DESC',
            [tempTransectionType], (tx, results) => {
              var temp = [];
             if(results.rows.length>0){
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              this.setState({
                FlatListItems: temp,
              });}
              else {
                this.setState({ NoDataFoundView: true })
              }
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


          tx.executeSql('SELECT * FROM  Invoices where IsActive =1  ORDER BY InvoiceID DESC', [], (tx, results) => {
            // tx.executeSql('SELECT InvoiceID,Date,TotalAmmount,CustomerName FROM  Invoices  Left Join Customers on Invoices.CustomerID =Customers.CustomerID  where IsActive =1  ORDER BY InvoiceID DESC', [], (tx, results) => {     
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

        if (this.state.TransectionType == "oncash" || this.state.TransectionType == "onloan") {

          var tempTransectionType;

          if (this.state.TransectionType == "oncash") {
            tempTransectionType = 1;

          }
          if (this.state.TransectionType == "onloan") {
            tempTransectionType = 0;

          }

          db.transaction(tx => {
            tx.executeSql('SELECT * FROM Invoices where (Date LIKE ? OR TotalAmmount LIKE ? OR CustomerName LIKE ?) AND OnCash = ? ', [temp, temp, temp, tempTransectionType], (tx, results) => {

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
            tx.executeSql('SELECT * FROM Invoices where (Date LIKE ? OR TotalAmmount LIKE ? OR CustomerName LIKE ?) AND IsActive =1 ', [temp, temp, temp], (tx, results) => {

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
          title={'ALL SALES'}
          rightIcon={NoDataFoundView ? undefined : 'search'}
          go={this.ShowHideComponent}
          backGroundColor={colors.primary}
        />

        {show ? null : (
          <View style={styles.searchWrap}>
            <TextInput
              autoFocus={true}
              style={styles.search}
              placeholder="Search customer name"
              placeholderTextColor={colors.textMuted}
              onChangeText={this.Search}
            />
          </View>
        )}

        {NoDataFoundView ? (
          <EmptyState
            icon="receipt"
            title="No sales yet"
            message="Recorded sales will appear here."
            actionLabel="Record a sale"
            onAction={() => this.props.navigation.navigate('SELL_SCREEN')}
          />
        ) : (
          <View style={styles.listWrap}>
            <TableHeader columns={[{ title: 'INV', width: '20%', align: 'center' }, { title: 'CUSTOMER', width: '50%' }, { title: 'AMOUNT', width: '30%', align: 'center' }]} />
            <FlatList
              data={rows}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <TableRow
                  index={index}
                  onPress={() => { this.props.navigation.navigate('SELL_DEATAIL_SCREEN', { invid: item.InvoiceID, transType: this.state.TransectionType }) }}
                  cells={[{ text: String(item.InvoiceID), width: '20%', align: 'center' }, { text: String(item.CustomerName), width: '50%', strong: true }, { text: String(item.TotalAmmount), width: '30%', align: 'center' }]}
                />
              )}
            />
          </View>
        )}

        {NoDataFoundView ? null : (
          <FloatingAction
            color={colors.primary}
            onPressMain={() => this.props.navigation.navigate('SELL_SCREEN')}
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
