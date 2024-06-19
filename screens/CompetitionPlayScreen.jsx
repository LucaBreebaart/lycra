import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { getCompetitionHoles } from '../services/DbService';
import Svg, { Path, Circle } from 'react-native-svg';

const CompetitionPlayScreen = ({ route, navigation }) => {
    const { CompetitionId, userId } = route.params || {}; 

    const [holes, setHoles] = useState([]);
    const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHoles = async () => {
            if (!CompetitionId) {
                setLoading(false); 
                return; 
            }

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
            navigation.navigate('ScoreSummary', { competitionId: CompetitionId, userId, scores });
        }
    };

    if (!CompetitionId) {
        return (
            <ImageBackground
                style={styles.noCompetitionsContainer}
                source={{ uri: "https://images.unsplash.com/photo-1500932334442-8761ee4810a7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            >
                <SafeAreaView style={styles.noCompetitionsContainer}>
                    <Text style={styles.noCompetitionsMessage}>Please select a competition to play.</Text>
                    <TouchableOpacity style={styles.noCompetitionsButton} onPress={() => navigation.navigate('Competitions')}>
                        <Text style={styles.noCompetitionsButtonText}>Go to Competitions</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ImageBackground>
        );
    }

    if (loading || !holes || holes.length === 0 || currentHoleIndex >= holes.length) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    const currentHole = holes[currentHoleIndex];

    return (
        <SafeAreaView style={styles.container}>

            <Image
                source={{ uri: currentHole.holeImage }}
                style={styles.holeImage}
                contentFit="fill"
            />

            <Image
                style={styles.cloud}
                source={require('../assets/images/cloud2.png')}
            />

            <Image
                style={styles.cloud2}
                source={require('../assets/images/cloud.png')}
            />

            <View style={styles.header}>
                <Text style={styles.headerHeading}>Hole {currentHole.holeNumber}</Text>
                <Text style={styles.headerSubHeading}>Pretoria Country Club</Text>
            </View>

            <View style={styles.infoContainer}>

                <View style={styles.infoBox}>
                    <Svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                        <Path
                            d="M1 12.4286V1.83333C1 1.4405 1 1.24408 1.12204 1.12204C1.24408 1 1.4405 1 1.83333 1H7.4525C7.79313 1 7.96344 1 8.11658 1.06343C8.26972 1.12687 8.39015 1.2473 8.63101 1.48816L9.08327 1.94042C9.32413 2.18127 9.44456 2.3017 9.5977 2.36514C9.75085 2.42857 9.92116 2.42857 10.2618 2.42857H17.3128C17.7659 2.42857 17.9924 2.42857 18.0604 2.57062C18.1284 2.71266 17.9864 2.88914 17.7022 3.2421L14.1778 7.6203C13.9762 7.87076 13.8754 7.99599 13.8754 8.14286C13.8754 8.28973 13.9762 8.41496 14.1778 8.66541L17.7022 13.0436C17.9864 13.3966 18.1284 13.5731 18.0604 13.7151C17.9924 13.8571 17.7659 13.8571 17.3128 13.8571H10.2618C9.92116 13.8571 9.75085 13.8571 9.5977 13.7937C9.44456 13.7303 9.32413 13.6098 9.08327 13.369L8.63101 12.9167C8.39015 12.6759 8.26972 12.5554 8.11658 12.492C7.96344 12.4286 7.79313 12.4286 7.4525 12.4286H1ZM1 12.4286V21"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </Svg>
                    <Text style={styles.infoText}>Distance {currentHole.distance}</Text>
                    <Svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <Circle cx="10" cy="11" r="9" stroke="white" strokeWidth="2" />
                        <Circle cx="15" cy="6" r="5" fill="#246362" stroke="white" strokeWidth="2" />
                    </Svg>
                    <Text style={styles.infoText}>Par {currentHole.par}</Text>

                </View>

                <View style={styles.scoreContainer}>
                    <TouchableOpacity
                        style={styles.incrementDecrementBtn}
                        onPress={() => handleScoreChange(currentHole.holeNumber, scores[currentHole.holeNumber] ? parseInt(scores[currentHole.holeNumber], 10) + 1 : 1)}
                    >
                        <Text style={styles.incrementDecrementText}>+</Text>
                    </TouchableOpacity>

                    <View style={styles.scoreCircle}>
                        <Text style={styles.scoreText}>{scores[currentHole.holeNumber] || 0}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.incrementDecrementBtn}
                        onPress={() => handleScoreChange(currentHole.holeNumber, scores[currentHole.holeNumber] ? parseInt(scores[currentHole.holeNumber], 10) - 1 : 0)}
                    >
                        <Text style={styles.incrementDecrementText}>-</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.nextBtn} onPress={handleNextHole}>
                    <Text style={styles.buttonText}>Next Hole</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: '#F4FDFD',
        gap: 10,
        position: 'relative',
        alignItems: 'left',
        top: 20,
    },
    header: {
        width: '100%',
        height: 'auto',
        top: -50,
        backgroundColor: '#246362',
        paddingHorizontal: 20,
        paddingVertical: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'space-between',
        gap: 10,
        paddingTop: 50,
        borderRadius: 12,
    },
    headerHeading: {
        fontSize: 36,
        color: 'white',
        fontFamily: 'Michroma'
    },
    headerSubHeading: {
        fontSize: 22,
        color: 'white',
        fontFamily: 'Michroma'
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
        position: 'absolute',
        width: 200,
        height: 650,
        overflow: "visible",
        bottom: 20,
        right: 20,
        zIndex: 0,
        // backgroundColor: 'yellow',
    },
    btnContainer: {
        bottom: 40,
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    nextBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50,
        paddingVertical: 5,
        borderRadius: 12,
        backgroundColor: '#246362',
        width: 250,
        height: 58,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 2,
        borderColor: 'white',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '500'
    },
    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 20,
        top: -20,
    },
    infoBox: {
        borderRadius: 16,
        backgroundColor: '#246362',
        width: 120,
        height: 'auto',
        justifyContent: 'flex-end',
        padding: 15,
        gap: 20,
        alignItems: 'left',
    },
    infoText: {
        color: '#FFFFFF',
        fontSize: 24,
        textAlign: 'left',
        fontWeight: '500',
    },
    scoreContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: 20,
    },
    scoreCircle: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: '#246362',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    scoreText: {
        color: '#FFFFFF',
        fontSize: 50,
    },
    incrementDecrementBtn: {
        width: 60,
        height: 60,
        borderRadius: 60,
        backgroundColor: '#D7E072',
        justifyContent: 'center',
        alignItems: 'center',
    },
    incrementDecrementText: {
        color: '#1E1E1E',
        fontSize: 40,
    },
    cloud: {
        position: 'absolute',
        left: 20,
        top: 400,
        width: 300,
        height: 50,
        overflow: 'visible',
    },
    cloud2: {
        position: 'absolute',
        right: 0,
        bottom: 200,
        width: 200,
        height: 50,
        overflow: 'visible',
    },
    noCompetitionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: 10,
    },
    noCompetitionsMessage: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Michroma',
        color: 'white',
        width: 300,
    },
    noCompetitionsButton: {
        backgroundColor: '#246362',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    noCompetitionsButtonText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Inter',
        textAlign: 'center',
    },
});

export default CompetitionPlayScreen;
