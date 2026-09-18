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


export default class Customers_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      FlatListItems: [],
      FlateListSearchItem: [],
      SearchCustomerName: null,
      VisibleSearch: true,
      show: true,
      ColorChange: false,
      isvisbleOverlay: false,
      NoDataFoundView: false,

      CustomerName: null,
      CustomerEmail: null,
      CustomerPhoneNumber: null,
      CustomerAddress: null,
    }


    this.getCustomers();




  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };


  getCustomers = () => {

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        // alert(this.state.ComapanyName);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Customers where IsActive =1 ORDER BY CustomerID', [], (tx, results) => {
            var temp = [];
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

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Customers where CustomerName LIKE ? AND IsActive =1 ORDER BY CustomerName', [temp], (tx, results) => {

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
          title={'CUSTOMERS'}
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
            icon="account-plus-outline"
            title="No customers yet"
            message="Add your first customer to start recording sales."
            actionLabel="Add customer"
            onAction={() => this.props.navigation.navigate('ADD_CUSTOMER_SCREEN')}
          />
        ) : (
          <View style={styles.listWrap}>
            <TableHeader columns={[{ title: 'ID', width: '22%', align: 'center' }, { title: 'CUSTOMER NAME', width: '78%' }]} />
            <FlatList
              data={rows}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <TableRow
                  index={index}
                  onPress={() => { this.setState({ isvisbleOverlay: true, CustomerName: item.CustomerName, CustomerPhoneNumber: item.CustomerPhoneNumber, CustomerEmail: item.CustomerEmail, CustomerAddress: item.CustomerAddress }) }}
                  onLongPress={() => this.props.navigation.navigate("ADD_CUSTOMER_SCREEN", { cid: item.CustomerID, cname: item.CustomerName, cphoneno: item.CustomerPhoneNumber, cemail: item.CustomerEmail, caddress: item.CustomerAddress })}
                  cells={[{ text: String(item.CustomerID), width: '22%', align: 'center' }, { text: String(item.CustomerName), width: '78%', strong: true }]}
                />
              )}
            />
          </View>
        )}

        {NoDataFoundView ? null : (
          <FloatingAction
            color={colors.primary}
            onPressMain={() => this.props.navigation.navigate('ADD_CUSTOMER_SCREEN')}
          />
        )}

        <Overlay
          isVisible={this.state.isvisbleOverlay}
          onBackdropPress={() => this.setState({ isvisbleOverlay: false })}
          width="86%">
          <Text style={styles.overlayTitle}>Customer details</Text>
          <DetailRow label="Name" value={this.state.CustomerName} />
          <DetailRow label="Phone" value={this.state.CustomerPhoneNumber} />
          <DetailRow label="Email" value={this.state.CustomerEmail} />
          <DetailRow label="Address" value={this.state.CustomerAddress} last />
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
