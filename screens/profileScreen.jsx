import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, ScrollView, Button, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { auth } from '../firebase';
import { handleSignOut } from '../services/authService';
import { getCompetitionList } from '../services/DbService';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useFocusEffect } from '@react-navigation/native';
import { getUserDetails } from '../services/DbService';

function ProfileScreen({ navigation }) {

  const [currentUser, setCurrentUser] = useState(null);
  const [CompetitionItems, setCompetitionItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);


  const handleGettingOfData = async () => {
    setRefreshing(true);
    const allData = await getCompetitionList()
    setCompetitionItems(allData)
    setRefreshing(false);
  }

  const handleLogout = () => {
    handleSignOut();
  };

  useFocusEffect(
    React.useCallback(() => {
      handleGettingOfData()
      return () => { };
    }, [])
  )

  const renderCompetition = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      navigation.navigate("Details", {
        CompetitionId: item.id,
        CompetitionTitle: item.title,
      });
    }}>
      <Text style={styles.heading}>
        {item.title}
      </Text>
      <View style={styles.subheadingContainer}>
        <View style={styles.icon}>
          <Feather name="calendar" size={18} color="white" />
        </View>
        <Text style={styles.subheading}>
          {item.date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const goToAdd = () => { navigation.navigate("Add") };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>

        {currentUser && (
          <Image
            style={styles.profileImage}
            source={{ uri: currentUser.profilePhoto }}
          />
        )}

        <View style={styles.svgContainer}>

          <Svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 393 114" fill="none" style={styles.svg}>
            <Path d="M0 0H213.946C238.317 0 260.934 12.6756 273.655 33.4634L275.147 35.9021C287.867 56.69 310.484 69.3656 334.855 69.3656H393V114H0V0Z" fill="#F4FDFD" />
          </Svg>

          <View style={styles.nameContainer}>

            {currentUser && (
              <View>
                <Text style={styles.nameText}>{currentUser.username}</Text>
                <Text style={styles.namesubText}>{currentUser.email}</Text>

              </View>
            )}
          </View>

        </View>

        <View style={styles.compContainer}>

          <View style={styles.buttonsContainer}>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
            
            <Pressable style={styles.addButton} onPress={goToAdd}>
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>

          <FlatList
            data={CompetitionItems}
            vertical
            renderItem={renderCompetition}
            keyExtractor={item => item.id}
            onRefresh={handleGettingOfData}
            refreshing={refreshing}
            ListEmptyComponent={<Text>No Competitions</Text>}
          />

        </View>

      </View>
    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: '#F4FDFD',
    gap: 10,
    marginBottom: -140,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black"
  },
  profileImage: {
    position: 'relative',
    width: '100%',
    height: 400,
    backgroundColor: 'black'
  },
  headerContainer: {
    width: '100%',
    height: 'auto',
    top: 0,
    backgroundColor: '#246362',
    paddingHorizontal: 20,
    paddingVertical: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
    paddingTop: 70,
    borderRadius: 12,
  },
  svgContainer: {
    position: 'relative',
    top: -100,
    // backgroundColor: 'black',
    width: '100%',
    height: 140,
    contentFit: 'fill',
  },
  svg: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  nameContainer: {
    position: 'relative',
    // backgroundColor: 'green',
    top: 25,
    paddingHorizontal: 20,
    display: 'flex',
    gap: 5,
  },
  nameText: {
    fontSize: 26,
    color: 'black',
    fontFamily: 'Inter',
    marginBottom: 10,
  },
  namesubText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Inter',
  },
  card: {
    width: '100%',
    backgroundColor: '#E5F4F9',
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
    borderRadius: 12,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Michroma'
  },
  subheading: {
    fontSize: 18,
  },
  subheadingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    backgroundColor: '#246362',
    padding: 7,
    borderRadius: 100,
  },
  compContainer: {
    width: '100%',
    height: '100%',
    top: -140,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  logoutButton: {
    width: '50%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#246362',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  addButton: {
    width: '50%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#246362',
  },
  addButtonText: {
    color: '#246362',
    fontWeight: 'bold',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }

});