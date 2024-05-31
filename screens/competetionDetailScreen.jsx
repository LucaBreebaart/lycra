import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { getCompetitionDetails, getCompetitionHoles } from '../services/DbService';

const CompetitionDetailScreen = ({ route }) => {
    const { CompetitionId, CompetitionTitle } = route.params;

    const [competitionDetails, setCompetitionDetails] = useState({});
    const [holes, setHoles] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            const details = await getCompetitionDetails(CompetitionId);
            setCompetitionDetails(details);
            const holesData = await getCompetitionHoles(CompetitionId);
            setHoles(holesData);
        };
        fetchDetails();
    }, [CompetitionId]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{CompetitionTitle}</Text>
            <Text style={styles.date}>{competitionDetails.date}</Text>
            <FlatList
                data={holes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.holeItem}>
                        <Text>Hole {item.holeNumber}: Par {item.par}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 18,
        color: 'grey',
        marginBottom: 20,
    },
    holeItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default CompetitionDetailScreen;
