import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import splash from '../assets/bg-image.png';
import { handleRegister } from '../services/authService';


export default function SignUp({ navigation }) {
  const [username, onUsernameChange] = useState("");
  const [email, onEmailChange] = useState("");
  const [password, onPasswordChange] = useState("");

  const handleSignUp = async () => {
    try {
      const user = { username, email, password };
      const success = await handleRegister(user);
      
    } catch (error) {
      console.error("Error in handleSignUp:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.bodycontainer}>
      <Image source={splash} style={styles.splash} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>Sign Up</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={onUsernameChange}
            placeholder='Username'
            placeholderTextColor='white'
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={onEmailChange}
            placeholder='Email'
            placeholderTextColor='white'
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={onPasswordChange}
            placeholder='Password'
            placeholderTextColor='white'
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={handleSignUp}>
            <View style={styles.loginButton}><Text style={styles.loginTxt}>Sign Up</Text></View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: '100%',
    height: "100%",
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 240,
    backgroundColor: "#133C2A",
    borderRadius: 20,
  },
  bodycontainer: {
    display: "flex",
    position: "relative",
    width: '100%',
    height: "100%",
  },
  splash: {
    position: 'absolute',
    width: "100%",
    height: "100%",
  },
  content: {
    width: '100%',
  },
  header: {
    color: 'white',
    fontFamily: 'semiBold',
    fontSize: 30,
    marginTop: 40,
    width: 'auto',
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginTop: 30,
    width: '100%',
    padding: 10,
    backgroundColor: 'none',
    fontSize: 15,
    color: "white"
  }, loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#95B4A2',
    borderRadius: 15,
    marginTop: 50
  }, loginTxt: {
    color: '#133C2A',
    fontFamily: 'semiBold',
    fontWeight: "600",
    textAlign: 'center',
    fontSize: 18
  }

});