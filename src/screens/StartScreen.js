import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyHeader from '../components/Header';
import { FloatingAction } from "../components/FloatingAction";
import { openDatabase } from 'react-native-sqlite-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { EmptyState } from '../components/ui';
import { colors } from '../theme';


export default class StartScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
    }
    this.getompanyNames();
  }


  ////this function get all company name from main datebase
  // and put it in flatelistitem varibale

  getompanyNames = () => {
    var db = openDatabase({ name: "MainDatebase" });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM CompanyDetails where IsActive =1', [], (tx, results) => {
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

  ///this function call the _insertCurrentDatabaseName for 
  // save current using compnay name into asyncstorage
  //and navigate to Login screen
  saveCurrentDatabasename = (CN) => {
    this._insertCurrentDatabaseName(CN);  ///call function to save current company name
    { this.props.navigation.navigate("LOGINCOMPANY") }  //navigate to login Screen
  }


  //this function save current using compnay name into asyncstorage
  _insertCurrentDatabaseName = async (CN) => {
    try {
      await AsyncStorage.setItem('CurrentCompanyName', CN);
    } catch (error) {
    }
  }




  render() {
    const companies = this.state.FlatListItems || [];

    return (
      <View style={styles.container}>
        <MyHeader title={'SIMS'} backGroundColor={colors.primary} />

        {companies.length === 0 ? (
          <EmptyState
            icon="storefront-outline"
            title="No businesses yet"
            message="Register a company to start recording sales and stock."
            actionLabel="Create company"
            onAction={() => this.props.navigation.navigate('CREATECOMPANY')}
          />
        ) : (
          <FlatList
            data={companies}
            keyExtractor={(item, index) => String(index)}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View>
                <Text style={styles.title}>Your businesses</Text>
                <Text style={styles.subtitle}>
                  {companies.length === 1
                    ? '1 company on this device'
                    : companies.length + ' companies on this device'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                activeOpacity={0.7}
                onPress={() => this.saveCurrentDatabasename(item.CompanyName)}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {String(item.CompanyName || '?').trim().charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.CompanyName}
                  </Text>
                  <Text style={styles.rowMeta} numberOfLines={1}>
                    Tap to sign in
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            )}
          />
        )}

        {companies.length === 0 ? null : (
          <FloatingAction
            color={colors.primary}
            onPressMain={() => this.props.navigation.navigate('CREATECOMPANY')}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 96,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  rowBody: { flex: 1 },
  rowTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rowMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
