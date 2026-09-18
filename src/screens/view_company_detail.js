import React from 'react';
import { FlatList, Text, View, Platform, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import { colors } from '../theme';

export default class view_company_detail_screen  extends React.Component {


constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
      company_name:'',
      available_company_name:"",
    }

    AsyncStorage.getItem('databaseName', (err, result) => {
      // alert("AsyncStorage"+result)
      console.log(result);

      this.setState({available_company_name:result})
      

    });

  }


setcompanyname=(text)=>{
this.setState({company_name:text})
  }


view_Company=()=>{
//  var db = openDatabase({ name: 'ksqure20.db' }); 
  const { company_name } = this.state;
//alert(company_name);
  var dbname=company_name+".db";
  var db = openDatabase({ name:dbname }); 

  db.transaction(tx => {
    tx.executeSql('SELECT * FROM LOGIN_TABLE', [], (tx, results) => {
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

  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.2, width: '100%', backgroundColor: colors.textMuted }} />
    );
  };
  render() {
    return (
      <View>


<Text> available companies  ={this.state.available_company_name}</Text>
 
 

<TextInput style={styles.TextInputStyle} placeholder="Enter  Company Name :" placeholderTextColor={colors.primaryLight}     onChangeText= {this.setcompanyname} />
      

<TouchableOpacity style={styles.buttonStyle}  onPress={this.view_Company}>
        <View > 
        
        <Text style={styles.buttonTextStyle}>view</Text>
        
        </View>
      </TouchableOpacity>



      <TouchableOpacity style={styles.buttonStyle}  onPress={() => this.props.navigation.navigate('STARTSCREEN')}>
        <View > 
        
        <Text style={styles.buttonTextStyle1}>goto home</Text>
        
        </View>
      </TouchableOpacity>

        <FlatList
        
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item.comapny_name} style={{ backgroundColor: 'white', padding: 20 }}>
              <Text>company name: {item.comapny_name}</Text>
              <Text>user name: {item.user_name}</Text>
              <Text>password: {item.user_password}</Text>
              <Text>finacial_year_starting_date: {item.finacial_year_starting_date}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}












const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  buttonStyle: {
  
    textAlign: 'center',
    margin: 12,
  },
  buttonTextStyle: {
      fontSize: 28,
    textAlign: 'center',
    color: colors.primaryLight,
    marginBottom: 8,
  },

  buttonTextStyle1: {
    fontSize: 14,
  textAlign: 'center',
  color: colors.textPrimary,
  marginBottom: 8,
},
  TextInputStyle:{
    
    margin: 12,
    width:300,
    borderWidth: 1,
    borderRadius:8
  }
});
