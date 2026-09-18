import React, {Component} from 'react';
import {Text, View,TouchableOpacity,StyleSheet} from 'react-native';
import { colors } from '../theme';




const NormalButton=(props)=>{
  return(
    
    <TouchableOpacity style={styles.buttonStyle} onPress={props.go}>
    <View > 
    
    <Text style={styles.buttonTextStyle}>{props.tilte}</Text>
    
    </View>
  </TouchableOpacity>

)
}




const styles = StyleSheet.create({

  buttonStyle: {
  
    textAlign: 'center',
    margin: 10,
  },
  buttonTextStyle: {
      fontSize: 30,
    textAlign: 'center',
    color: colors.primaryLight,
    marginBottom: 5,
  },

  buttonTextStyle1: {
    fontSize: 15,
  textAlign: 'center',
  color: colors.textPrimary,
  marginBottom: 5,
},
  
});

export default NormalButton;