import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, ScrollView, Button, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icons if not already imported
import { auth } from '../firebase';
import { handleSignOut } from '../services/authService';
import { getMyBucketList } from '../services/DbService'; // Import function to get joined competitions
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure you have the correct path to your firebase config

function ProfileScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [bucketItems, setBucketItems] = useState([]);
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
      fetchBucketItems();
    };

    fetchUserData();
  }, []);

  const fetchBucketItems = async () => {
    setRefreshing(true);
    try {
      const allData = await getMyBucketList();
      setBucketItems(allData);
    } catch (error) {
      console.error('Error fetching bucket items:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    handleSignOut();
  };

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

        <Image
          style={styles.profileImage}
          source={require('../assets/images/profile2.jpg')}
        />

        <View style={styles.svgContainer}>

          <Svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 393 114" fill="none" style={styles.svg}>
            <Path d="M0 0H213.946C238.317 0 260.934 12.6756 273.655 33.4634L275.147 35.9021C287.867 56.69 310.484 69.3656 334.855 69.3656H393V114H0V0Z" fill="#F4FDFD" />
          </Svg>

          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>Profile</Text>

            {currentUser && (
              <View>
                <Text>{currentUser.username}</Text>
                <Text>{currentUser.email}</Text>
                <Button title="Logout" onPress={handleLogout} />
              </View>
            )}
          </View>

        </View>

        <View style={styles.compContainer}>

          <Pressable style={styles.addButton} onPress={goToAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>

          <FlatList
            data={bucketItems}
            vertical
            renderItem={renderCompetition}
            keyExtractor={item => item.id}
            onRefresh={fetchBucketItems}
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
  addButton: {
    backgroundColor: 'white',
    borderColor: 'green',
    borderWidth: 2,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  },
  addButtonText: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold'
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
    color: 'white',
    fontSize: 26,
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
    height: 'auto',
    top: -140,
    paddingHorizontal: 20,
    paddingVertical: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  }

});