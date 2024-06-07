// ResultsScreen.jsx

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { getCompetitionScores, getUserDetails } from '../services/DbService';

const ResultsScreen = ({ route }) => {
    const { CompetitionId, CompetitionTitle } = route.params;

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            const scores = await getCompetitionScores(CompetitionId);
            const resultsWithDetails = await Promise.all(scores.map(async score => {
                const userDetails = await getUserDetails(score.userId);
                return { ...score, username: userDetails.username };
            }));
            setResults(resultsWithDetails);
            setLoading(false);
        };
        fetchResults();
    }, [CompetitionId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerHeading}>Results for {CompetitionTitle}</Text>
            <FlatList
                data={results}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <Text>{item.username}: {JSON.stringify(item.scores)}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F4FDFD',
    },
    headerHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    resultItem: {
        marginBottom: 16,
    },
});

export default ResultsScreen;
