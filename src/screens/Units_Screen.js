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
import { TableHeader, TableRow, EmptyState } from '../components/ui';



export default class Units_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      FlatListItems: [],
      FlateListSearchItem: [],
      SearchCustomerName: null,
      NoDataFoundView: false,
      UnitID: null,
      UnitName: null,
      UnitSymbol: null,

      VisibleSearch: true,
      show: true,
      isvisbleOverlay: false,

    }


    this.getUnits();




  }

  ShowHideComponent = () => {


    if (this.state.show == true) {
      this.setState({ show: false });

    } else {
      this.setState({ show: true });

    }
  };


  getUnits = () => {

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        // alert(this.state.ComapanyName);

        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM UnitOfMeasure where IsActive =1 ORDER BY UnitName', [], (tx, results) => {
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
          tx.executeSql('SELECT * FROM  UnitOfMeasure where UnitName LIKE ? AND IsActive =1 ORDER BY UnitName ', [temp], (tx, results) => {

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
          title={'UNITS'}
          rightIcon={NoDataFoundView ? undefined : 'search'}
          go={this.ShowHideComponent}
          backGroundColor={colors.primary}
        />

        {show ? null : (
          <View style={styles.searchWrap}>
            <TextInput
              autoFocus={true}
              style={styles.search}
              placeholder="Search unit name"
              placeholderTextColor={colors.textMuted}
              onChangeText={this.Search}
            />
          </View>
        )}

        {NoDataFoundView ? (
          <EmptyState
            icon="ruler"
            title="No units yet"
            message="Units of measure let you price and stock items."
            actionLabel="Add unit"
            onAction={() => this.props.navigation.navigate('ADD_INVENTORY_UNIT_SCREEN')}
          />
        ) : (
          <View style={styles.listWrap}>
            <TableHeader columns={[{ title: 'ID', width: '20%', align: 'center' }, { title: 'NAME', width: '50%' }, { title: 'SYMBOL', width: '30%' }]} />
            <FlatList
              data={rows}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <TableRow
                  index={index}
                  onLongPress={() => this.props.navigation.navigate("ADD_INVENTORY_UNIT_SCREEN", { uid: item.UnitID, uname: item.UnitName, usymbol: item.UnitSymbol })}
                  cells={[{ text: String(item.UnitID), width: '20%', align: 'center' }, { text: String(item.UnitName), width: '50%', strong: true }, { text: String(item.UnitSymbol), width: '30%' }]}
                />
              )}
            />
          </View>
        )}

        {NoDataFoundView ? null : (
          <FloatingAction
            color={colors.primary}
            onPressMain={() => this.props.navigation.navigate('ADD_INVENTORY_UNIT_SCREEN')}
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
