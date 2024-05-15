import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './screens/homeScreen';
import ProfileScreen from './screens/profileScreen';
import Login from './screens/Login';
import SignUp from './screens/SignUp';


const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    const prepare = async () => {
      // keep splash screen visible
      await SplashScreen.preventAutoHideAsync()

      // pre-load your stuff
      await new Promise(resolve => setTimeout(resolve, 8000))

      // hide splash screen
      await SplashScreen.hideAsync()
    }
    prepare()
  }, [])

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="SignUp" component={SignUp} />
      </Tab.Navigator>
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