// HomeScreen.jsx

import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { handleSignOut } from '../services/authService';

function HomeScreen() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    handleSignOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      {currentUser && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>Logged in as: {currentUser.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151718"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#ECEDEE"
  },
  userInfoContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  userInfo: {
    fontSize: 16,
    color: "#ECEDEE",
    marginBottom: 10
  }
});
