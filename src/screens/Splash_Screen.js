import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  SplashScreenImage from '../image/splashScreen.png';
import { openDatabase } from 'react-native-sqlite-storage';
import { colors } from '../theme';



export default class Splash_Screen extends Component {



    constructor(props) {
        super(props);
        this.state = {
            FirstTimeOpening: 0,
        }

        /////////////////////////////////////////////////
        // cheak the apps start /use first time by use 
        //if first time return nothing if not first time return 1 in  FirstTimeOpening in variable
        ///////////////////////////////////////////////////'
        AsyncStorage.getItem('firsttime', (err, result) => {
            if (result !== null) {
                this.setState({ FirstTimeOpening: result })
            }
        });

    }

    componentDidMount() {
        setTimeout(() => {
            if (this.state.FirstTimeOpening == 1) {
                this.props.navigation.navigate('STARTSCREEN')
            }
            else {
                var db = openDatabase({ name: "MainDatebase" });
                db.transaction(function (txn) {
                    txn.executeSql(
                      "SELECT name FROM sqlite_master WHERE type='table' AND name='CompanyDetails'",
                      [],
                      function (txn, res) {
                        if (res.rows.length == 0) {
                          txn.executeSql('CREATE TABLE IF NOT EXISTS CompanyDetails(CompanyName VARCHAR(50) PRIMARY KEY , Date VARCHAR(20),IsActive INTEGER DEFAULT 1)',
                           []);
                     
                        }
                      },
                    );
                  });
               
                this.props.navigation.navigate('CREATECOMPANY')
            }
        }, 1000)
    }


//    firstTimeUSe = async () => {
//         try {
//           await AsyncStorage.setItem('firsttime',"1");
//         } catch (error) {
//         }
//       }

    render() {
        return (
            <View style={styles.container}>
                <Image source={SplashScreenImage} style={styles.image} />
              <View>
              <Text style={styles.text}>SIMS</Text>
              <Text style={{color:colors.textSecondary}}>Manage Your Business</Text>
          

              </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    image:{
        width:140,
        height:140
    },
    text:{
        color:colors.primaryLight,
        alignContent:"center",
        alignSelf:"center",
        fontSize:20
    }

});
