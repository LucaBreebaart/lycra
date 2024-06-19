import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { getCompetitionList } from '../services/DbService';
import { useFocusEffect } from '@react-navigation/native';

function CompetitionScreen({ navigation }) {

  const [CompetitionItems, setCompetitionItems] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      handleGettingOfData()
      return () => { };
    }, [])
  )

  const handleGettingOfData = async () => {
    setRefreshing(true);
    const allData = await getCompetitionList()
    setCompetitionItems(allData)
    setRefreshing(false);
  }
  
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


  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>Competitions</Text>
          <Text style={styles.headerSubHeading}>[ All Competitions ]</Text>
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
    </ScrollView>
  )
}

export default CompetitionScreen

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: "100%",
    height: "140%",
    backgroundColor: '#F4FDFD',
    top: -10,
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
})
