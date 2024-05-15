import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import splash from '../assets/splash.png';


export default function SignUp({ navigation }) {

    const [username, onUsernameChange] = useState("");
    const [email, onEmailChange] = useState("");
    const [password, onPasswordChange] = useState("");


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
                        placeholderTextColor='#000'
                    />

                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={onEmailChange}
                        placeholder='Email'
                        placeholderTextColor='#000'
                    />

                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={onPasswordChange}
                        placeholder='Password'
                        placeholderTextColor='#000'
                        secureTextEntry={true}
                    />

                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <View style={styles.loginButton}><Text style={styles.loginTxt}>Sign Up</Text></View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <View style={styles.signup}><Text style={styles.signupTxt}>Login</Text></View>
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
        justifyContent: "center",
        width: '100%',
        height: "100%",
        padding: 40,
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
        marginTop: 100,
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
        padding: 20,
        backgroundColor: 'green',
        borderRadius: 50,
        marginTop: 40
    }, loginTxt: {
        color: '#fff',
        fontFamily: 'semiBold',
        textAlign: 'center',
        fontSize: 18
    }, signup: {
        width: '100%',
        padding: 20,
        borderColor: 'green',
        borderWidth: 2,
        backgroundColor: 'white',
        borderRadius: 50,
        marginTop: 20
    }, signupTxt: {
        color: 'black',
        fontFamily: 'semiBold',
        textAlign: 'center',
        fontSize: 18
    },

});