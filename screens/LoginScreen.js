import React from "react";
import { Button,Text, TextInput, View, StyleSheet, Pressable, ToastAndroid } from 'react-native';
import { Formik } from 'formik';
import axios from 'react-native-axios';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ( {navigation} ) => {
	const config = {
        headers: {
            'content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
        } 
    } 
	return (
	<Formik
     initialValues={{
      email: '', 
      password: '', 
	  	}} 
	    onSubmit={async (input) => {  

	    console.log(JSON.stringify(input))
	   	await axios.post('http://192.168.1.9:8000/api/login', input, config).then(res => { 
	      	SecureStore.setItemAsync('token', 'Bearer '+res.data.token); 
	      	navigation.navigate('Notes');
	   })  
	.catch(err => { 
	ToastAndroid.showWithGravityAndOffset(
      "Incorrect email or password!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
 		
	   console.log(err);  
	});  
	}  
	}  
   	>
     {({ handleChange, handleBlur, handleSubmit, values }) => (
       <View style={styles.container}>
       <Text style={styles.textTitle}> Sign In </Text>
         <TextInput
           onChangeText={handleChange('email')}
           onBlur={handleBlur('email')}
           value={values.email}
		   style={styles.inputText}
		   placeholder="Email"
         />

         <TextInput
           onChangeText={handleChange('password')}
           onBlur={handleBlur('password')}
           value={values.password}
		   style={styles.inputText}
		   placeholder="Password"
		   secureTextEntry={true}
         />

         <Pressable style={styles.button} onPress={handleSubmit}>
      					<Text style={styles.textRegister}>Login</Text>
    	 </Pressable>

         <Pressable style={styles.buttonRegister} onPress={()=> navigation.navigate('Register')}>
      					<Text style={styles.textRegister}>You don't have an account ?</Text>
    	 </Pressable>
       </View>
     )}
   </Formik>
	);
}

const styles = StyleSheet.create ({
	container: {
		flex:1,
		alignItems:'center',
		justifyContent:'center', 
		backgroundColor: '#fff'
	},

	inputContainer: {
		borderBottomWidth :0,
	},
	inputText:{
		borderColor: '#00073d',
		width: '85%',
		margin: 12,
		textAlign: 'center',
		borderWidth: 1.5,
		marginVertical:10,
		borderRadius:100,
		height: 50,
		color: "#000",
		fontSize: 15,
		marginLeft: 10
	},
	wrapper: {
		backgroundColor :'#00073d'
	},
	image: {
		width: 200,
		height : 250,
		marginVertical: 50
	},
	textTitle:{
		color: "#ed0055",
		fontSize: 40,
		marginVertical: 10
	},
	button: {
	width : '90%',
	backgroundColor : "#ed0055",
	borderRadius:100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginVertical:10,
    elevation: 3,
  },
  buttonRegister: {
	width : '90%',
	backgroundColor : "#00073d",
	borderRadius:100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginVertical:50,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#fff',
  },
   textRegister: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#fff',
  },
});

export default LoginScreen