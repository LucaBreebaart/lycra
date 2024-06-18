import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/homeScreen';
import ProfileScreen from './screens/profileScreen';
import CompetitionScreen from './screens/competetionScreen';
import CompetitionDetailScreen from './screens/competetionDetailScreen';
import CompetitionPlayScreen from './screens/CompetitionPlayScreen';
import ScoreSummaryScreen from './screens/ScoreSummaryScreen';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import CreateScreen from './screens/CreateScreen';

import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons'; // Import Feather icons

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Competitions') {
          iconName = 'list';
        } else if (route.name === 'PlayCompetition') {
          iconName = 'play-circle';
        } else if (route.name === 'Profile') {
          iconName = 'user';
        }

        return <Feather name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#246362',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#f8f8f8', // Adjust the background color here
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Competitions" component={CompetitionScreen} options={{ headerShown: false }} />
    <Tab.Screen name="PlayCompetition" component={CompetitionPlayScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

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
      await SplashScreen.preventAutoHideAsync();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setUserId(user.uid);
      } else {
        setLoggedIn(false);
        setUserId(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Stack.Navigator>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Details" options={{ headerShown: false }}>
            {(props) => <CompetitionDetailScreen {...props} userId={userId} />}
          </Stack.Screen>
          <Stack.Screen name="ScoreSummary" component={ScoreSummaryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Add" component={CreateScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
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
