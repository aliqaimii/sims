import MyHeader from '../components/Header';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import { TextInput, Modal } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';


export default class Login_company_screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ComapanyName: '',
      user_name: '',
      user_password: '',
      userData: '',
      currentUsingDatabase: '',
      userData: null,

      FavouriteColor: null,
      FavouriteCity: null,
      FavouritePerson: null,

      NewPassword: null,
      RetypeNewPassword: null,


      secure_password_entry: true,
      ShowHide_password_lable: "Show Password",

      isView1Visible: true,
      isView2Visible: false,
      isView3Visible: false,
      isfooterVisible: true,

    };

    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        this.setState({ currentUsingDatabase: abc })
      }
    });


    AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
      if (result !== null) {
        var abc = result;
        this.setState({ ComapanyName: abc });
        var db_name = abc + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });
        db.transaction(tx => {
          tx.executeSql(
            'SELECT user_name FROM LOGIN_TABLE',
            [],
            (tx, results) => {
              if (results.rows.length >= 0) {

                var temp = results.rows.item(0);
                this.setState({ user_name: temp.user_name })


              }

            }
          );


        });
      }
    });



  }



  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate('STARTSCREEN')
      return true;
    });
  }



  componentWillUnmount() {
    this.backHandler.remove();
  }




  setcompanyname = (text) => {
    this.setState({ ComapanyName: text })
  }


  set_user_name = (text) => {
    this.setState({ user_name: text })

  }

  set_user_password = (text) => {
    this.setState({ user_password: text })
  }

  onText1Press = () => {
    if (this.state.secure_password_entry === true) {
      this.setState({ secure_password_entry: false })
      this.setState({ ShowHide_password_lable: "Hide  Password" })

    }
    else {
      this.setState({ secure_password_entry: true })
      this.setState({ ShowHide_password_lable: "Show  Password" })



    }
  }

  Login = () => {

    var that = this;
    const { ComapanyName } = this.state;
    const { user_name } = this.state;
    const { user_password } = this.state;

    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });
    db.transaction(tx => {
      tx.executeSql('SELECT user_name,user_password FROM LOGIN_TABLE', [], (tx, results) => {
        if (results.rows.length >= 0) {

          this.setState({ userData: results.rows.item(0) })
          //  alert(this.state.userData.user_password +"  "+this.state.userData.user_name);
          if (user_name == this.state.userData.user_name && user_password == this.state.userData.user_password) {
            this.props.navigation.navigate("HOME_SCREEN")
          }
          else {
            alert("Incorrect Password")
          }

        }
      });
    });





  }

  onNext = () => {

    var that = this;
    const { ComapanyName } = this.state;


    var db_name = ComapanyName + ".db";
    db_name = db_name.replace(/\s/g, '');
    var db = openDatabase({ name: db_name });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM LOGIN_TABLE Where Favourite_color = ? AND Favourite_City = ? AND Favourite_Person = ? '
        , [this.state.FavouriteColor, this.state.FavouriteCity, this.state.FavouritePerson],
        (tx, results) => {
          if (results.rows.length > 0) {

            this.setState({ isView2Visible: false, isView3Visible: true })
          }
          else {
            alert("IN correct" + results.rows.length)
          }
        });
    });





  }
  onSave = () => {


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
                      if (userData.user_password !== this.state.NewPassword) {
                        tx.executeSql(
                          'UPDATE LOGIN_TABLE set  user_password =?',
                          [this.state.NewPassword],
                          (tx, results) => {
                            if (results.rowsAffected > 0) {
                              alert("Password Change Succesfully");
                              this.setState({ isView3Visible: false, isfooterVisible: true, isView1Visible: true }) 
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
  render() {



    return (

      <View style={styles.container}>
        <MyHeader
          title={this.state.currentUsingDatabase}
          rightIcon={"home"}
          backGroundColor={colors.primary}
          go={() => this.props.navigation.navigate('STARTSCREEN')}
        />

        {
          this.state.isView1Visible ?
            <View style={styles.form}>
              <View style={styles.brand}>
                <MaterialCommunityIcons name="storefront-outline" size={30} color={colors.primary} />
              </View>
              <Text style={styles.title}>Sign in</Text>
              <Text style={styles.subtitle}>
                Enter your credentials for {this.state.currentUsingDatabase}
              </Text>

              <View style={styles.card}>
                <TextInput style={styles.TextInputStyle}
                  underlineColor={colors.border}
                  activeUnderlineColor={colors.primary}
                  label="Username"
                  value={this.state.user_name}
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="account-outline" />}
                  returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.passwordref.focus()}
                  onChangeText={this.set_user_name} />

                <TextInput style={styles.TextInputStyle}
                  underlineColor={colors.border}
                  activeUnderlineColor={colors.primary}
                  label="Password"
                  autoFocus={true}
                  autoCapitalize="none"
                  ref={ref => this.passwordref = ref}
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={
                    <TextInput.Icon
                      icon={this.state.secure_password_entry ? 'eye-outline' : 'eye-off-outline'}
                      onPress={() => { this.onText1Press() }}
                    />
                  }
                  returnKeyType="done"
                  onSubmitEditing={() => this.Login()}
                  secureTextEntry={this.state.secure_password_entry}
                  onChangeText={this.set_user_password} />

                <TouchableOpacity style={styles.buttonStyle} onPress={() => this.Login()} activeOpacity={0.85}>
                  <Text style={styles.buttonTextStyle}>Login</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotLink}
                activeOpacity={0.6}
                onPress={() => {
                  this.setState({ isView1Visible: false, isfooterVisible: false, isView2Visible: true })
                }}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            : null

        }
        {
          this.state.isView2Visible ?
            <View style={styles.form}>

              <Text style={styles.resetTitle}>Reset your password</Text>
              <Text style={styles.resetSubtitle}>
                Answer the security questions you set when creating this company.
              </Text>
              <TextInput underlineColor={colors.primary} style={styles.TextInputStyle} label="Favourite Color"
                autoFocus={true}
                onSubmitEditing={() => this.FvCity.focus()} returnKeyType="next" blurOnSubmit={false}
                value={this.state.FavouriteColor}
                onChangeText={(text) => { this.setState({ FavouriteColor: text }) }}
              />

              <TextInput

                onSubmitEditing={() => this.FvPerson.focus()} ref={ref => this.FvCity = ref}
                value={this.state.FavouriteCity}
                underlineColor={colors.primary} style={styles.TextInputStyle} label="Favourite City  " returnKeyType="next" blurOnSubmit={false}
                onChangeText={(text) => { this.setState({ FavouriteCity: text }) }}

              />

              <TextInput
                ref={ref => this.FvPerson = ref}
                underlineColor={colors.primary} style={styles.TextInputStyle} label="Favourite Person"
                value={this.state.FavouritePerson}
                onChangeText={(text) => { this.setState({ FavouritePerson: text }) }}


              />

              <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 12 }}>

                <TouchableOpacity style={[styles.buttonStyle1, styles.buttonSecondary]} onPress={() => this.setState({ isView2Visible: false, isfooterVisible: true, isView1Visible: true })}>
                  <Text style={[styles.buttonTextStyle1, styles.buttonTextSecondary]}>Cancel</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.buttonStyle1} onPress={() => this.setState({ isView2Visible: false, isView3Visible: true })}> */}
                <TouchableOpacity style={styles.buttonStyle1} onPress={() => this.onNext()}>
                  <View >
                    <Text style={styles.buttonTextStyle1}>Next</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            : null
        }





        {this.state.isView3Visible ?

          <View style={{ width: '100%', justifyContent: "center", backgroundColor: colors.textOnDark, alignItems: "center", marginTop: 100 }}>



            <TextInput style={styles.TextInputStyle}
              autoFocus={true}
              secureTextEntry={this.state.secure_password_entry}
              ref={ref => this.NewPassword = ref}
              returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.RetypeNewPassword.focus()}
              placeholder="New Password :" placeholderTextColor={colors.primary}
              onChangeText={(text) => { this.setState({ NewPassword: text }) }}
            />

            <TextInput style={styles.TextInputStyle}
              secureTextEntry={this.state.secure_password_entry}
              ref={ref => this.RetypeNewPassword = ref}
              returnKeyType="next" blurOnSubmit={false}
              placeholder="ReType New Password :" placeholderTextColor={colors.primary}
              onChangeText={(text) => { this.setState({ RetypeNewPassword: text }) }}
            />

            <TouchableOpacity style={{ marginLeft: 180, margin: 8 }} onPress={() => { this.onText1Press() }}>
              <Text style={{ fontSize: 14, color: "black", marginTop: 8 }}>{this.state.ShowHide_password_lable}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 12 }}>


              <TouchableOpacity style={styles.buttonStyle1} onPress={() => { this.setState({ isView3Visible: false, isfooterVisible: true, isView1Visible: true }) }} >
                <View >
                  <Text style={styles.buttonTextStyle1} >CANCEL</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonStyle1} onPress={this.onSave} >
                <View >
                  <Text style={styles.buttonTextStyle1} >SAVE</Text>
                </View>
              </TouchableOpacity>

            </View>

          </View>

          : null
        }












        {/* <TouchableOpacity style={styles.buttonStyle} onPress={() => this.props.navigation.navigate("HOME_SCREEN")} >
          <View >
            <Text style={styles.buttonTextStyle} >direct Login</Text>
          </View>
        </TouchableOpacity> */}

        {/*       
      <TouchableOpacity style={styles.buttonStyle} onPress={()=>this.props.navigation.navigate("VIEW_COMPANY_DETAIL")}  >
        <View > 
        
        <Text style={styles.buttonTextStyle} >view All</Text>
        
        </View>
      </TouchableOpacity> */}









      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  brand: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  forgotLink: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    marginTop: 16,
    width: '100%',
    borderRadius: 10,

    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    elevation: 2,
  },
  buttonStyle1: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    textAlign: 'center',
    margin: 8,
    width: 140,
    borderRadius: 8,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 20,
    elevation: 2,
  },
  buttonTextStyle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
    color: colors.textOnDark,
    marginBottom: 8,
  },

  buttonTextStyle1: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.textOnDark,
    paddingVertical: 12,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  resetTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
  },
  resetSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  TextInputStyle: {
    marginVertical: 8,
    backgroundColor: colors.surface,
    width: '100%',
  },
  Footer: {
    minHeight: 56,
    width: "100%",
    backgroundColor: colors.textOnDark,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
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
