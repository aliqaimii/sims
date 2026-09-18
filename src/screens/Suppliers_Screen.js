
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


export default class Suppliers_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      SupplierName: "",
      FlatListItems: [],
      FlateListSearchItem: [],
      SerachSupplierName: null,
      VisibleSearch: true,
      show: true,

      NoDataFoundView: false,
      ColorChange: false,
      isvisbleOverlay: false,

      SupplierName: null,
      SupplierEmail: null,
      SupplierPhoneNumber: null,
      SupplierAddress: null,

    }


    this.getSuppliers();




  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };


  getSuppliers = () => {

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ SupplierName: abc });
        // alert(this.state.SupplierName);

        var db_name = this.state.SupplierName + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Suppliers where IsActive =1 ORDER BY SupplierID', [], (tx, results) => {
            var temp = [];
            if (results.rows.length > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              console.log(temp);

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
    this.setState({ SerachSupplierName: text })


    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ SupplierName: abc });
        // alert(this.state.SupplierName);

        var db_name = this.state.SupplierName + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });
        var temp = '%' + this.state.SerachSupplierName + '%';

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Suppliers where SupplierName LIKE ? AND IsActive =1 ORDER BY SupplierName', [temp], (tx, results) => {

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
          title={'SUPPLIERS'}
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
            icon="truck-outline"
            title="No suppliers yet"
            message="Add a supplier to start recording purchases."
            actionLabel="Add supplier"
            onAction={() => this.props.navigation.navigate('ADD_SUPPLIER_SCREEN')}
          />
        ) : (
          <View style={styles.listWrap}>
            <TableHeader columns={[{ title: 'ID', width: '22%', align: 'center' }, { title: 'SUPPLIER NAME', width: '78%' }]} />
            <FlatList
              data={rows}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <TableRow
                  index={index}
                  onPress={() => { this.setState({ isvisbleOverlay: true, SupplierName: item.SupplierName, SupplierPhoneNumber: item.SupplierPhoneNumber, SupplierEmail: item.SupplierEmail, SupplierAddress: item.SupplierAddress }) }}
                  onLongPress={() => this.props.navigation.navigate("ADD_SUPPLIER_SCREEN", { sid: item.SupplierID, sname: item.SupplierName, sphoneno: item.SupplierPhoneNumber, semail: item.SupplierEmail, saddress: item.SupplierAddress })}
                  cells={[{ text: String(item.SupplierID), width: '22%', align: 'center' }, { text: String(item.SupplierName), width: '78%', strong: true }]}
                />
              )}
            />
          </View>
        )}

        {NoDataFoundView ? null : (
          <FloatingAction
            color={colors.primary}
            onPressMain={() => this.props.navigation.navigate('ADD_SUPPLIER_SCREEN')}
          />
        )}

        <Overlay
          isVisible={this.state.isvisbleOverlay}
          onBackdropPress={() => this.setState({ isvisbleOverlay: false })}
          width="86%">
          <Text style={styles.overlayTitle}>Supplier details</Text>
          <DetailRow label="Name" value={this.state.SupplierName} />
          <DetailRow label="Phone" value={this.state.SupplierPhoneNumber} />
          <DetailRow label="Email" value={this.state.SupplierEmail} />
          <DetailRow label="Address" value={this.state.SupplierAddress} last />
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
