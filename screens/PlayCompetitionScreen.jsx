import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Button, TextInput } from 'react-native';
import { getCompetitionHoles, submitScores } from '../services/DbService';

const PlayCompetitionScreen = ({ route, navigation }) => {
    const { CompetitionId, CompetitionTitle } = route.params;

    const [holes, setHoles] = useState([]);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHoles = async () => {
            const holesData = await getCompetitionHoles(CompetitionId);
            setHoles(holesData);
            setLoading(false);
        };
        fetchHoles();
    }, [CompetitionId]);

    const handleScoreChange = (holeNumber, score) => {
        setScores({ ...scores, [holeNumber]: score });
    };

    const handleSubmitScores = async () => {
        await submitScores(CompetitionId, scores);
        navigation.navigate('Results', { CompetitionId, CompetitionTitle });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerHeading}>Playing {CompetitionTitle}</Text>
            <FlatList
                data={holes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.holeItem}>
                        <Text>Hole {item.holeNumber}: Par {item.par}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Enter Score"
                            onChangeText={(text) => handleScoreChange(item.holeNumber, text)}
                        />
                    </View>
                )}
            />
            <Button title="Complete" onPress={handleSubmitScores} />
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
    holeItem: {
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        paddingHorizontal: 8,
    },
});

export default PlayCompetitionScreen;
