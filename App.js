import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/homeScreen';
import ProfileScreen from './screens/profileScreen';
import CompetetionScreen from './screens/competetionScreen';
import Login from './screens/Login';
import SignUp from './screens/SignUp';

import CreateScreen from './screens/CreateScreen';

import * as Font from 'expo-font';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Michroma: require('./assets/fonts/Michroma.ttf'),
      });
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync()
      await new Promise(resolve => setTimeout(resolve, 1000))
      await SplashScreen.hideAsync()
    }
    prepare()
  }, [])

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  return (

    <NavigationContainer>
      {loggedIn ? (

        <Tab.Navigator >
          <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
          <Tab.Screen name="Competetions" component={CompetetionScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Add" component={CreateScreen} options={{ headerShown: false }}/>
        </Tab.Navigator>

      ) : (

        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>

      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
