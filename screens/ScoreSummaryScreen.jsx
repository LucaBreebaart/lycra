import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { submitScoresToDb } from '../services/DbService';

const ScoreSummaryScreen = ({ route, navigation }) => {
    const { competitionId, userId, scores } = route.params;

    const renderScore = ({ item }) => (
        <View style={styles.scoreItem}>
            <Text style={styles.scoreText}>{item.holeNumber}</Text>
            <Text style={styles.scoreText}>4</Text> {/* Replace with actual par value if available */}
            <Text style={styles.scoreText}>{item.score}</Text>
        </View>
    );    
    

    const handleComplete = async () => {
        const success = await submitScoresToDb(competitionId, userId, scores);
        if (success) {
            navigation.navigate('Home');
        } else {
            alert('Failed to submit scores. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Score Summary</Text>
            </View>
            <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.header2]}>Hole</Text>
                <Text style={[styles.cell, styles.header2]}>Par</Text>
                <Text style={[styles.cell, styles.header2]}>Score</Text>
            </View>
            <FlatList
                data={Object.keys(scores).map(key => ({ holeNumber: key, score: scores[key] }))}
                renderItem={({ item }) => (
                    <View style={styles.scoreRow}>
                        <Text style={[styles.cell, styles.holeCell]}>Hole {item.holeNumber}</Text>
                        <Text style={[styles.cell, styles.parCell]}>Par eg</Text>
                        <Text style={[styles.cell, styles.scoreCell]}>{item.score}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.holeNumber.toString()}
                contentContainerStyle={styles.scoreList}
            />
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
        
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    headerContainer: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        marginBottom: 20,
        paddingVertical: 40,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 10,
        paddingBottom: 5,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    header2: {
        fontFamily: 'inter',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingVertical: 10,
    },
    holeCell: {
        flex: 1,
        textAlign: 'center',
    },
    parCell: {
        flex: 1,
        textAlign: 'center',
    },
    scoreCell: {
        flex: 1,
        textAlign: 'center',
    },
    completeButton: {
        width: 250,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#246362',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 2,
        borderColor: 'white',
        alignSelf: 'center',
        marginTop: 20,
    },
    completeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


export default ScoreSummaryScreen;
