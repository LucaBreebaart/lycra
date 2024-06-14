import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Button, ScrollView, LogBox } from 'react-native';
import { getCompetitionDetails, getCompetitionHoles, joinCompetition, getCompetitionParticipants, getUserDetails } from '../services/DbService';
import { auth } from '../firebase';
import { Image } from 'expo-image';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const CompetitionDetailScreen = ({ route, navigation }) => {
    const { CompetitionId, CompetitionTitle } = route.params;

    const [competitionDetails, setCompetitionDetails] = useState({});
    const [holes, setHoles] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [userHasJoined, setUserHasJoined] = useState(false);
    const [loading, setLoading] = useState(true);

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
            setParticipants(participantsDetails);

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
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
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
                        Nestled amidst the breathtaking vistas of British Columbia's Coast Mountains, Whistler Bike Park stands as a mecca for mountain biking enthusiasts worldwide. Renowned for its unparalleled terrain and adrenaline-pumping trails, this iconic destination beckons riders of all levels to experience the ultimate thrill on two wheels.
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

                <View style={styles.participantsContainer}>
                    <Text style={styles.participantsTitle}>Participants:</Text>
                    <FlatList
                        data={participants}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.participantItem}>
                                <Text>{item.username}</Text>
                            </View>
                        )}
                    />
                </View>

                {userHasJoined && (
                   <Button title="Play" onPress={() => navigation.navigate('PlayCompetition', { CompetitionId, userId: currentUser.uid })} />
                )}

                {!userHasJoined && (
                    <Button title="Join Competition" onPress={handleJoinCompetition} style={styles.holeText} />
                )}
                
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: '#F4FDFD',
        gap: 10,
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
        paddingBottom: 15,
    },
    holeItem: {
        position: 'relative',
        padding: 10,
        width: 200,
        height: 200,
        backgroundColor: "#D7E072",
        padding: 10,
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
        marginTop: 20,
    },
    participantsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    participantItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
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
    }
    
});

export default CompetitionDetailScreen;
