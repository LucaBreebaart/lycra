import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import splash from '../assets/bg-image.png';
import { handlelogin } from '../services/authService';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    handlelogin(email, password);
  }

  return (
    <View style={styles.bodycontainer}>
      <Image source={splash} style={styles.splash} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>Welcome back</Text>
          <KeyboardAvoidingView>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder='Email'
              placeholderTextColor='white'
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder='Password'
              placeholderTextColor='white'
              secureTextEntry={true}
            />
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={login}>
            <View style={styles.loginButton}><Text style={styles.loginTxt}>Login</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <View style={styles.signup}><Text style={styles.signupTxt}>Sign Up</Text></View>
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
  }, signup: {
    width: '100%',
    padding: 15,
    borderColor: '#95B4A2',
    borderWidth: 4,
    borderRadius: 15,
    marginTop: 30
  }, signupTxt: {
    color: 'white',
    fontFamily: 'semiBold',
    fontWeight: "600",
    textAlign: 'center',
    fontSize: 18
  },
  home: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    marginTop: 20
  }
});