import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import logo from '../assets/icon.png';


export default function SignUp({}) {

    const [username, onUsernameChange] = useState("");
    const [email, onEmailChange] = useState("");
    const [password, onPasswordChange] = useState("");

    
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.bigCircle}></View>
                <View style={styles.smolCircle}></View>
            </View>

            <View style={styles.content}>
                <Image source={logo} style={styles.logo} />
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
                
                
                <TouchableOpacity >
                    <View style={styles.loginButton}><Text style={styles.loginTxt}>Sign Up</Text></View>
                </TouchableOpacity>

                <TouchableOpacity>
                    <View style={styles.signup}><Text style={styles.signupTxt}>Login</Text></View>
                </TouchableOpacity>

            </View>


        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        padding: 40
    }, content: {
        width: '100%',
    },
    logo: {
        width: 90,
        height: 41,
        marginTop: 20,
    },
    header: {
        color: '#000000',
        fontFamily: 'semiBold',
        fontSize: 30,
        marginTop: 100,
        width: '80%'
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginTop: 30,
        width: '100%',
        padding: 10,
        backgroundColor: 'white',
        fontSize: 15,
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
    }
});