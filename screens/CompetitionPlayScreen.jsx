import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { getCompetitionHoles } from '../services/DbService';

const CompetitionPlayScreen = ({ route, navigation }) => {
    const { CompetitionId, userId } = route.params;
    const [holes, setHoles] = useState([]);
    const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
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

    const handleNextHole = () => {
        if (currentHoleIndex < holes.length - 1) {
            setCurrentHoleIndex(currentHoleIndex + 1);
        } else {
            // All holes completed, navigate to summary screen
            navigation.navigate('ScoreSummary', { competitionId: CompetitionId, userId, scores });
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    const currentHole = holes[currentHoleIndex];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Hole {currentHole.holeNumber}</Text>
            <Text style={styles.subHeader}>Par {currentHole.par}</Text>
            <Image
                source={{ uri: currentHole.holeImage }}
                style={styles.holeImage}
                contentFit="fill" />
            <TextInput
                style={styles.input}
                placeholder="Enter your score"
                keyboardType="numeric"
                onChangeText={(text) => handleScoreChange(currentHole.holeNumber, text)}
                value={scores[currentHole.holeNumber]}
            />
            <Button title="Next" onPress={handleNextHole} />
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
    },
    subHeader: {
        fontSize: 18,
        marginVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        width: '80%',
    },
    holeImage: {
        width: 100,
        height: 100,
        // overflow: "visible",
    }
});

export default CompetitionPlayScreen;
