import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { submitScoresToDb } from '../services/DbService';

const ScoreSummaryScreen = ({ route, navigation }) => {
    const { competitionId, userId, scores } = route.params;

    const renderScore = ({ item }) => (
        <View style={styles.scoreItem}>
            <Text>Hole {item.holeNumber}: {item.score}</Text>
        </View>
    );

    const handleComplete = async () => {
        const success = await submitScoresToDb(competitionId, userId, scores);
        if (success) {
            navigation.navigate('Details', { CompetitionId: competitionId });
        } else {
            alert('Failed to submit scores. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Score Summary</Text>
            <FlatList
                data={Object.keys(scores).map(key => ({ holeNumber: key, score: scores[key] }))}
                renderItem={renderScore}
                keyExtractor={(item) => item.holeNumber.toString()}
            />
            <Button title="Complete" onPress={handleComplete} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    scoreItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ScoreSummaryScreen;
