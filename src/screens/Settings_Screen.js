import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyHeader from '../components/Header';
import { openDatabase } from 'react-native-sqlite-storage';
import { TextInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';



export default class Settings_Screen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: "",
      headerTitle: "SETTING",
      CurrentUserName: null,
      CurrentPassword: null,
      NewUserName: null,
      RetypeNewUserName: null,
      NewPassword: null,
      RetypeNewPassword: null,
      istext1Visble: true,
      istext2Visble: true,
      isView1Visible: false,
      isView2Visible: false,
    }

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

  changeUserName = () => {

    if (this.state.CurrentPassword !== null) {
      if (this.state.NewUserName !== null) {
        if (this.state.RetypeNewUserName !== null) {
          if (this.state.NewUserName == this.state.RetypeNewUserName) {
            AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
              if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT user_name,user_password FROM LOGIN_TABLE',
                    [],
                    (tx, results) => {
                      var userData = results.rows.item(0);

                      console.log('Results', results.rowsAffected);
                      if (userData.user_password == this.state.CurrentPassword) {
                        if (userData.user_name !== this.state.NewUserName) {
                          tx.executeSql(
                            'UPDATE LOGIN_TABLE set  user_name =?',
                            [this.state.NewUserName],
                            (tx, results) => {
                              if (results.rowsAffected > 0) {

                                alert("UserName Change Succesfully");
                                this.setState({ CurrentUserName: null });
                                this.setState({ CurrentPassword: null });
                                this.setState({ NewUserName: null });
                                this.setState({ RetypeNewUserName: null });
                                this.setState({ NewPassword: null });
                                this.setState({ RetypeNewPassword: null });
                                this.setState({ headerTitle: "SETTINGS" });
                                this.setState({ istext1Visble: true });
                                this.setState({ istext2Visble: true });
                                this.setState({ isView1Visible: false });
                                this.setState({ isView2Visible: false });

                              }
                              else {

                                alert("UserName Did Not Change")

                              }
                            }
                          );


                          ///////////////////////////////////


                        }
                        else {
                          alert("Please Chosses A New UserName")
                        }
                      }
                      else {
                        alert("Password Incorre")
                      }

                    }
                  );


                });
              }
            });

          }
          else {
            alert("New UserName Does Not Match")
          }
        }
        else {
          alert("Please Fill Retype New UserName")
        }
      }
      else {
        alert("Please Fill New UserName")
      }
    }
    else {
      alert("Please Fill Password")
    }
  }

  changePassword = () => {

    if (this.state.CurrentPassword !== null) {
      if (this.state.NewPassword !== null) {
        if (this.state.RetypeNewPassword !== null) {
          if (this.state.NewPassword == this.state.RetypeNewPassword) {
            if (this.state.NewPassword.length >= 7) {
              AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
                if (result !== null) {
                  var abc = result;
                  this.setState({ ComapanyName: abc });
                  var db_name = abc + ".db";
                  db_name = db_name.replace(/\s/g, '');
                  var db = openDatabase({ name: db_name });
                  db.transaction(tx => {
                    tx.executeSql(
                      'SELECT user_password FROM LOGIN_TABLE',
                      [],
                      (tx, results) => {
                        var userData = results.rows.item(0);

                        console.log('Results', results.rowsAffected);
                        if (userData.user_password == this.state.CurrentPassword) {
                          if (userData.user_password !== this.state.NewPassword) {
                            tx.executeSql(
                              'UPDATE LOGIN_TABLE set  user_password =?',
                              [this.state.NewPassword],
                              (tx, results) => {
                                if (results.rowsAffected > 0) {
                                  alert("Password Change Succesfully");
                                  this.setState({ CurrentUserName: null });
                                  this.setState({ CurrentPassword: null });
                                  this.setState({ NewUserName: null });
                                  this.setState({ RetypeNewUserName: null });
                                  this.setState({ NewPassword: null });
                                  this.setState({ RetypeNewPassword: null });
                                  this.setState({ headerTitle: "SETTINGS" });
                                  this.setState({ istext1Visble: true });
                                  this.setState({ istext2Visble: true });
                                  this.setState({ isView1Visible: false });
                                  this.setState({ isView2Visible: false });
                                }
                                else {
                                  alert("Password Did Not Change")

                                }
                              }
                            );
                          }
                          else {
                            alert("Please Chosse A New Password")
                          }
                        }
                        else {
                          alert("Password Incorre")
                        }
                      }
                    );
                  });
                }
              });
            }
            else {
              alert("Password Have Atlest 8 Character")
            }
          }
          else {
            alert("New Password Does Not Match")
          }
        }
        else {
          alert("Please Fill Retype New Password")
        }
      }
      else {
        alert("Please Fill New Password")
      }
    }
    else {
      alert("Please Fill Password")
    }
  }

  onCancel = () => {
    this.setState({ headerTitle: "SETTINGS" })
    this.setState({ CurrentUserName: null });
    this.setState({ CurrentPassword: null });
    this.setState({ NewUserName: null });
    this.setState({ RetypeNewUserName: null });
    this.setState({ NewPassword: null });
    this.setState({ RetypeNewPassword: null });
    this.setState({ istext1Visble: true });
    this.setState({ istext2Visble: true });
    this.setState({ isView1Visible: false });
    this.setState({ isView2Visible: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <MyHeader
          title={this.state.headerTitle}
          backGroundColor={colors.primary}
        />

        {this.state.istext1Visble ?

          <TouchableOpacity
            style={styles.TAOPstyle}
            onPress={() => this.setState({ isView1Visible: !this.state.isView1Visible, istext2Visble: this.state.isView1Visible, istext1Visble: false, headerTitle: "CHANGE USERNAME" })}
          >
            <Text style={styles.TextStyele}> Change UserName </Text>
            <MaterialCommunityIcons style={{ alignSelf: "center" }} name="account-edit" size={28} color={colors.onPrimary} />

          </TouchableOpacity>

          : null}

        {this.state.isView1Visible ?

          <View style={{ width: '100%', justifyContent: "center", backgroundColor: colors.textOnDark, alignItems: "center" }}>

            <TextInput style={styles.TextInputStyle}
              autoFocus={true}
              onSubmitEditing={() => this.NewUserName.focus()}
              secureTextEntry={true} placeholder="Enter Password :"
              placeholderTextColor={colors.primary} onChangeText={this.set_user_password}
              onChangeText={(text) => { this.setState({ CurrentPassword: text }) }}
            />

            <TextInput style={styles.TextInputStyle}
              ref={ref => this.NewUserName = ref}
              returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.ReTypeNewUserName.focus()}
              placeholder="New UserName :" placeholderTextColor={colors.primary} onChangeText={this.set_user_name}
              onChangeText={(text) => { this.setState({ NewUserName: text }) }}
            />

            <TextInput style={styles.TextInputStyle}
              ref={ref => this.ReTypeNewUserName = ref}
              returnKeyType="next" blurOnSubmit={false}
              placeholder="ReType New UserName :" placeholderTextColor={colors.primary} onChangeText={this.set_user_name}
              onChangeText={(text) => { this.setState({ RetypeNewUserName: text }) }}
            />

            <TouchableOpacity style={styles.buttonStyle} onPress={this.changeUserName} >
              <View >
                <Text style={styles.buttonTextStyle} >SAVE</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonStyle} onPress={this.onCancel} >
              <View >
                <Text style={styles.buttonTextStyle} >CANCEL</Text>
              </View>
            </TouchableOpacity>

          </View>

          : null
        }


        {this.state.istext2Visble ?

          <TouchableOpacity
            onPress={() => this.setState({ isView2Visible: !this.state.isView2Visible, istext1Visble: this.state.isView2Visible, istext2Visble: false, headerTitle: "CHANGE PASSWORD" })}
            style={styles.TAOPstyle}
          >
            <Text style={styles.TextStyele}> Change Password </Text>
            <MaterialCommunityIcons style={{ alignSelf: "center" }} name="form-textbox-password" size={28} color={colors.onPrimary} />
          </TouchableOpacity>

          :
          null}
        {this.state.isView2Visible ?

          <View style={{ width: '100%', justifyContent: "center", backgroundColor: colors.textOnDark, alignItems: "center" }}>

            <TextInput style={styles.TextInputStyle}
              autoFocus={true}
              onSubmitEditing={() => this.NewPassword.focus()}
              secureTextEntry={true} placeholder="Enter Current Password :"
              placeholderTextColor={colors.primary}
              onChangeText={(text) => { this.setState({ CurrentPassword: text }) }} />

            <TextInput style={styles.TextInputStyle}
              ref={ref => this.NewPassword = ref}
              returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.RetypeNewPassword.focus()}
              placeholder="New Password :" placeholderTextColor={colors.primary}
              onChangeText={(text) => { this.setState({ NewPassword: text }) }}
            />

            <TextInput style={styles.TextInputStyle}
              ref={ref => this.RetypeNewPassword = ref}
              returnKeyType="next" blurOnSubmit={false}
              placeholder="ReType New Password :" placeholderTextColor={colors.primary}
              onChangeText={(text) => { this.setState({ RetypeNewPassword: text }) }}
            />

            <TouchableOpacity style={styles.buttonStyle} onPress={this.changePassword} >
              <View >
                <Text style={styles.buttonTextStyle} >SAVE</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonStyle} onPress={this.onCancel} >
              <View >
                <Text style={styles.buttonTextStyle} >CANCEL</Text>
              </View>
            </TouchableOpacity>

          </View>
          :
          null
        }

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
  TAOPstyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: '98%',
    borderWidth: 1, borderColor: colors.primaryLight, borderRadius: 8,
    backgroundColor: colors.primary,
    margin: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  TextStyele: {
    fontSize: 18, color: colors.textOnDark, textAlignVertical: "center", margin: 12
  },
  TextInputStyle: {
    margin: 8,
    backgroundColor: colors.surface,
    width: "90%",
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    textAlign: 'center',
    margin: 8,
    width: '80%',
    borderRadius: 8,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonTextStyle: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.textOnDark,
    marginBottom: 8,
  },
});
