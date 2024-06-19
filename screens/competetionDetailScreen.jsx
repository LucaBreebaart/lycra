import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Button, ScrollView, LogBox, TouchableOpacity } from 'react-native';
import { getCompetitionDetails, getCompetitionHoles, joinCompetition, getCompetitionParticipants, getUserDetails, getScoresForCompetition } from '../services/DbService';
import { auth } from '../firebase';
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const CompetitionDetailScreen = ({ route, navigation }) => {
    const { CompetitionId, CompetitionTitle } = route.params;

    const [competitionDetails, setCompetitionDetails] = useState({});
    const [holes, setHoles] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [userHasJoined, setUserHasJoined] = useState(false);
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);

    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setUserHasJoined(false);
            const details = await getCompetitionDetails(CompetitionId);
            setCompetitionDetails(details);
            const holesData = await getCompetitionHoles(CompetitionId);
            setHoles(holesData);
            const participantIds = await getCompetitionParticipants(CompetitionId);

            if (participantIds.includes(currentUser.uid)) {
                setUserHasJoined(true);
            }

            const participantsDetails = await Promise.all(participantIds.map(id => getUserDetails(id)));
            console.log('Participants Details:', participantsDetails);
            setParticipants(participantsDetails);

            // Fetch scores and update leaderboard
            const scores = await getScoresForCompetition(CompetitionId);
            const participantScores = calculateParticipantScores(scores, participantsDetails);
            setLeaderboard(participantScores);

            setLoading(false);
        };

        fetchDetails();

        return () => {
            setCompetitionDetails({});
            setHoles([]);
            setParticipants([]);
            setUserHasJoined(false);
            setLoading(true);
        };
    }, [CompetitionId]);


    const calculateParticipantScores = (scores, participants) => {
        console.log('Scores:', scores);
        console.log('Participants:', participants);

        const scoreMap = {};

        scores.forEach(({ userId, score }) => {
            if (!scoreMap[userId]) {
                scoreMap[userId] = 0;
            }
            scoreMap[userId] += score;
        });

        console.log('Score Map:', scoreMap);

        return participants.map(participant => ({
            ...participant,
            totalScore: scoreMap[participant.id] !== undefined ? scoreMap[participant.id] : 0
        })).sort((a, b) => a.totalScore - b.totalScore);
    };

    const handleJoinCompetition = async () => {
        const success = await joinCompetition(CompetitionId, currentUser.uid);
        if (success) {
            setUserHasJoined(true);
            const userDetails = await getUserDetails(currentUser.uid);
            setParticipants([...participants, userDetails]);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <View style={styles.animationContainer}>
                    <LottieView
                        style={styles.animationContainer}
                        source={require('../assets/lottie/golf-animation.json')}
                        autoPlay
                        loop
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.headerHeading}>{CompetitionTitle}</Text>
                        <Text style={styles.headerSubHeading}>{competitionDetails.date}</Text>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: "https://images.unsplash.com/photo-1632946269126-0f8edbe8b068?q=80&w=2031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                        />
                    </View>

                    <View style={styles.detailsContainer}>
                        <Text style={styles.headerHeading}>Details</Text>
                        <Text style={styles.headerSubHeading}>
                            {competitionDetails.description}
                        </Text>
                    </View>

                    <FlatList
                        contentContainerStyle={styles.holeContainer}
                        horizontal
                        data={holes}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.holeItem}>
                                <Text style={styles.holeText}>Hole {item.holeNumber}:</Text>
                                <Text style={styles.holeText2}>Par {item.par}</Text>
                                <View style={styles.holeImageContainer}>
                                    <Image
                                        source={{ uri: item.holeImage }}
                                        style={styles.holeImage}
                                        contentFit="contain" />
                                </View>
                            </View>
                        )}
                    />

                    {leaderboard.length > 0 && (
                        <View style={styles.participantsScoreContainer}>
                            <Text style={styles.scoreTitle}>Leaderboard:</Text>

                            <View style={styles.podiumContainer}>
                                {leaderboard.length > 1 && (
                                    <View style={styles.podiumItem}>
                                        <Text style={styles.podiumText}>{leaderboard[1].username}</Text>
                                        <Text style={styles.podiumText}>{leaderboard[1].totalScore}</Text>
                                        <View style={[styles.podiumBlock, styles.podiumSecond]} />
                                        
                                    </View>
                                )}
                                {leaderboard.length > 0 && (
                                    <View style={styles.podiumItem}>
                                        <Text style={styles.podiumText}>{leaderboard[0].username}</Text>
                                        <Text style={styles.podiumText}>{leaderboard[0].totalScore}</Text>
                                        <View style={[styles.podiumBlock, styles.podiumFirst]} />
                                        
                                    </View>
                                )}
                                {leaderboard.length > 2 && (
                                    <View style={styles.podiumItem}>
                                        <Text style={styles.podiumText}>{leaderboard[2].username}</Text>
                                        <Text style={styles.podiumText}>{leaderboard[2].totalScore}</Text>
                                        <View style={[styles.podiumBlock, styles.podiumThird]} />
                                        
                                    </View>
                                )}
                            </View>

                            {leaderboard.length > 3 && (
                                <View style={styles.remainingParticipantsContainer}>
                                    {leaderboard.slice(3).map((participant, index) => (
                                        <View key={index} style={styles.scoreItem}>
                                            <Text style={styles.scoreparticipantName}>
                                                {index + 4}. {participant.username}: {participant.totalScore}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}


                    <View style={styles.participantsContainer}>
                        <Text style={styles.participantsTitle}>Participants:</Text>
                        <FlatList
                            data={participants}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.participantItem}>
                                    <Text style={styles.participantName}>{item.username}</Text>
                                </View>
                            )}
                        />
                    </View>

                </View>

            </ScrollView>

            <View style={styles.stickyButtonContainer}>
                <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={() => {
                        if (userHasJoined) {
                            navigation.navigate('MainTabs', {
                                screen: 'PlayCompetition',
                                params: { CompetitionId, userId: currentUser.uid }
                            });
                        } else {
                            handleJoinCompetition();
                        }
                    }}>
                    <Text style={styles.buttonText}>
                        {userHasJoined ? "Play" : "Join Competition"}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: '#F4FDFD',
        paddingBottom: 100,
        gap: 10,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%",
        width: '100%',
        backgroundColor: '#F4FDFD',
    },
    animationContainer: {
        width: 200,
        height: 200,
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
    image: {
        width: "100%",
        height: 300,
        borderRadius: 12,
    },
    detailsContainer: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#246362',
        paddingHorizontal: 20,
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'space-between',
        gap: 10,
        borderRadius: 12,
    },
    detailsHeading: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Michroma'
    },
    holeContainer: {
        gap: 10,
        marginBottom: 10,
    },
    holeItem: {
        position: 'relative',
        padding: 10,
        width: 200,
        height: 200,
        backgroundColor: "#D7E072",
        borderRadius: 12,
        overflow: 'hidden',
    },
    holeText: {
        fontSize: 24,
        color: 'black',
        fontFamily: "Michroma"
    },
    holeText2: {
        fontSize: 24,
        color: 'black',
        fontFamily: "Inter",
        fontWeight: '500',
    },
    participantsContainer: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#246362',
        paddingHorizontal: 20,
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'space-between',
        gap: 10,
        borderRadius: 12,
    },
    participantsTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Michroma',
    },
    participantItem: {
        padding: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    participantName: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Inter',
        width: '100%',
    },

    // Poduimm 

    participantsScoreContainer: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#246362',
        paddingHorizontal: 20,
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        borderRadius: 12,
        marginTop: -10,
    },
    scoreTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Michroma',
    },
    podiumContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginVertical: 20,
        width: '100%',
    },
    podiumItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    podiumText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Inter',
        marginBottom: 5,
    },
    podiumBlock: {
        width: 80,
        borderRadius: 10,
    },
    podiumFirst: {
        height: 100,
        backgroundColor: '#FFD700', // Gold
    },
    podiumSecond: {
        height: 80,
        backgroundColor: '#C0C0C0', // Silver
    },
    podiumThird: {
        height: 60,
        backgroundColor: '#CD7F32', // Bronze
    },
    scoreItem: {
        padding: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    scoreparticipantName: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Inter',
        width: '100%',
    },

    // Podium

    holeImageContainer: {
        position: 'absolute',
        right: -25,
        top: 40,
        width: 185,
    },
    holeImage: {
        top: 0,
        width: "100%",
        height: 425,
    },

    // Play button

    stickyButtonContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        padding: 10,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextBtn: {
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
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Michroma',
        textAlign: 'center',
    },

});

export default CompetitionDetailScreen;
