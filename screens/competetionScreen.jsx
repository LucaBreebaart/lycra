import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

function CompetetionScreen(){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Competetion</Text>
    </View>
  )
}

export default CompetetionScreen

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
  }
})