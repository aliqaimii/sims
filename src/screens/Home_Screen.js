import React, { Component } from 'react';
import MyHeader from '../components/Header';
import { StyleSheet, View, Text, TouchableOpacity, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwsome from 'react-native-vector-icons/dist/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { colors, spacing, radius, typography, elevation } from '../theme';



export default class Home_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      CustomersQuantity: "",
      SupplierQuantity: "",
      CashinHand:"",
      LoanAmmount:"",

    }

    this.getButtonValues();
  }

  ///////////////////////////get  values for buttons//////////////////////////

  getButtonValues = () => {

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Customers where IsActive =1', [],
            (tx, results) => {
              if (results.rows.length > 0) {
                this.setState({ CustomersQuantity: results.rows.length })
              }
            });

          tx.executeSql('SELECT * FROM Suppliers where IsActive =1', [],
            (tx, results) => {
              if (results.rows.length > 0) {
                this.setState({ SupplierQuantity: results.rows.length })
              }
            });

            db.transaction(tx => {
              tx.executeSql(
                  'Select SUM(TotalAmmount) as TOTALCASH FROM Invoices Where OnCash=1',
                  [],
                  (tx, results) => {
                      var tempmaxid = results.rows.item(0)
                      if (results.rows.length > 0) {
                          this.setState({
                              CashinHand: tempmaxid.TOTALCASH,
                          })
                      }
                  }
              );
          });

          db.transaction(tx => {
            tx.executeSql(
                'Select SUM(TotalAmmount) as TOTALCASH FROM Invoices Where OnCash=0',
                [],
                (tx, results) => {
                    var tempmaxid = results.rows.item(0)
                    if (results.rows.length > 0) {
                        this.setState({
                            LoanAmmount: tempmaxid.TOTALCASH,
                        })
                    }
                }
            );
        });


            ///////////////////
        });

      }

    });
  }

  ///////////////////////////get  values for buttons  finish//////////////////////////

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Logout", "Are you sure to close company",
        [{ text: "Cancel", onPress: () => { }, style: "cancel" },
        { text: "Logout", onPress: () => this.handleLogout() }], { cancelable: true });
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleLogout() {
    this.props.navigation.navigate('STARTSCREEN')
  }



  /** 1234567 -> "1,234,567"; blank/NaN -> "0". */
  formatAmount(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) {
      return '0';
    }
    const [whole, fraction] = String(Math.abs(n)).split('.');
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '-' : '') + grouped + (fraction ? '.' + fraction : '');
  }

  renderStat(icon, label, value, onPress) {
    return (
      <TouchableOpacity style={styles.stat} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.statIcon}>
          <FontAwsome name={icon} size={16} color={colors.primary} />
        </View>
        <Text style={styles.statLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      </TouchableOpacity>
    );
  }

  renderTile(icon, label, onPress) {
    return (
      <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.tileIcon}>
          <FontAwsome name={icon} size={22} color={colors.primary} />
        </View>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { CustomersQuantity, SupplierQuantity, CashinHand, LoanAmmount } = this.state;
    const go = (screen, params) => () =>
      this.props.navigation.navigate(screen, params);

    return (
      <View style={styles.container}>
        <MyHeader
          title={'HOME'}
          rightIcon={'arrow-back'}
          backGroundColor={colors.primary}
          go={() =>
            Alert.alert(
              'Logout',
              'Are you sure to close company',
              [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Logout', onPress: () => this.handleLogout() },
              ],
              { cancelable: true },
            )
          }
        />

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.sectionLabel}>OVERVIEW</Text>
          <View style={styles.statGrid}>
            {this.renderStat(
              'group',
              'Customers',
              this.formatAmount(CustomersQuantity),
              go('CUSTOMERS_SCRREN'),
            )}
            {this.renderStat(
              'truck',
              'Suppliers',
              this.formatAmount(SupplierQuantity),
              go('SUPPLIERS_SCRREN'),
            )}
            {this.renderStat(
              'money',
              'Sales on Cash',
              'PKR ' + this.formatAmount(CashinHand),
              go('ALL_SELL_SCREEN', { transType: 'oncash' }),
            )}
            {this.renderStat(
              'bank',
              'Sales on Loan',
              'PKR ' + this.formatAmount(LoanAmmount),
              go('ALL_SELL_SCREEN', { transType: 'onloan' }),
            )}
          </View>

          <Text style={styles.sectionLabel}>CATALOGUE</Text>
          <View style={styles.card}>
            {this.renderTile('list', 'Units', go('UNITS_SCREEN'))}
            {this.renderTile('sitemap', 'Categories', go('ITEMS_CATEGORY'))}
            {this.renderTile('th', 'Items', go('ITEMS_SCREEN'))}
          </View>

          <Text style={styles.sectionLabel}>SALES</Text>
          <View style={styles.card}>
            {this.renderTile(
              'book',
              'All Sales',
              go('ALL_SELL_SCREEN', { transType: 'All' }),
            )}
            {this.renderTile('list-alt', 'Sell', go('SELL_SCREEN'))}
            {this.renderTile('tasks', 'Inventory', go('INVENTORY'))}
          </View>

          <Text style={styles.sectionLabel}>PURCHASING</Text>
          <View style={styles.card}>
            {this.renderTile('leanpub', 'All Purchase', go('ALL_PURCHASE_SCREEN'))}
            {this.renderTile('cart-plus', 'Purchase', go('PURCHASE_SCREEN'))}
            {this.renderTile('gears', 'Settings', go('SETTINGS_SCREEN'))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // A tinted page behind white cards is what makes them read as cards.
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },

  // ---- Overview: a 2x2 stat grid instead of four cramped rows -------------
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  stat: {
    // Two per row, accounting for the gap between them.
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...elevation.low,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.subtitle,
    marginTop: spacing.xs,
  },

  // ---- Module groups ------------------------------------------------------
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    ...elevation.low,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  tileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileLabel: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
