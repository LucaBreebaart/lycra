import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { getMyBucketList } from '../services/DbService';
import { useFocusEffect } from '@react-navigation/native';

function CompetitionScreen({ navigation }) {

  const goToAdd = () => { navigation.navigate("Add") }
  const [bucketItems, setBucketItems] = useState([])
  const [refreshing, setRefreshing] = useState(false);

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

  const handleGettingOfData = async () => {
    setRefreshing(true);
    const allData = await getMyBucketList()
    setBucketItems(allData)
    setRefreshing(false);
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>Competitions</Text>
          <Text style={styles.headerSubHeading}>[Entered Competitions]</Text>
        </View>

        <Pressable style={styles.addButton} onPress={goToAdd}>
          <Text style={styles.addButtonText}>Add</Text>
          <Entypo name="bucket" size={16} color="green" />
        </Pressable>

        <FlatList
          data={bucketItems}
          vertical
          renderItem={renderCompetition}
          keyExtractor={item => item.id}
          onRefresh={handleGettingOfData}
          refreshing={refreshing}
          ListEmptyComponent={<Text>No Competitions</Text>}
        />
      </View>
    </SafeAreaView>
  )
}

export default CompetitionScreen

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: "100%",
    height: "140%",
    backgroundColor: '#F4FDFD',
    top: -50,
  },
  header: {
    width: '100%',
    height: 'auto',
    top: 0,
    backgroundColor: '#246362',
    paddingHorizontal: 20,
    paddingVertical: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
    paddingTop: 70,
    borderRadius: 12,
  },
  headerHeading: {
    fontSize: 36,
    color: 'white',
    fontFamily: 'Michroma'
  },
  headerSubHeading: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Michroma'
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
  }
})
