import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { createNewCompetitionItem, createNewHoleItem } from '../services/DbService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Alert } from 'react-native';

const CreateScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [holes, setHoles] = useState([]);
    const [holeNumber, setHoleNumber] = useState('');
    const [par, setPar] = useState('');
    const [holeImage, setHoleImage] = useState('');
    const [distance, setDistance] = useState('');
    const [description, setDescription] = useState('');
    const [competitionImage, setCompetitionImage] = useState('');

    const handleCreation = async () => {
        const combinedDateTime = new Date(date);
        combinedDateTime.setHours(time.getHours());
        combinedDateTime.setMinutes(time.getMinutes());

        if (!title.trim() || !date || !time || holes.length === 0 || !competitionImage.trim() || !description.trim()) {
            Alert.alert("Validation Error", "Please enter all required fields.");
            return;
        }

        const formattedDateTime = format(combinedDateTime, 'EEEE, MMMM d, yyyy h:mm a');

        const competition = {
            title,
            date: formattedDateTime,
            description,
            image: competitionImage
        };

        const success = await createNewCompetitionItem(competition);

        if (success) {
            const competitionId = success.id;
            for (let hole of holes) {
                await createNewHoleItem(competitionId, hole);
            }
            navigation.goBack();
        } else {
            console.error("Failed to create competition");
        }
    };

    const addHole = () => {
        if (!holeNumber || !par || !holeImage.trim() || !distance.trim()) {
            Alert.alert("Validation Error", "Please enter all required fields for the hole.");
            return;
        }
        setHoles([...holes, { holeNumber, par, holeImage, distance }]);
        setHoleNumber('');
        setPar('');
        setHoleImage('');
        setDistance('');
    };

    const displayFormattedDateTime = format(date, 'EEEE, MMMM d, yyyy') + ' at ' + format(time, 'h:mm a');

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Competition Title"
                        onChangeText={newText => setTitle(newText)}
                        value={title}
                    />

                    <TextInput
                        style={styles.inputField}
                        placeholder="Competition Image URL"
                        onChangeText={newText => setCompetitionImage(newText)}
                        value={competitionImage}
                    />

                    <View style={styles.datePickerContainer}>
                        <Text>Select Date:</Text>
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || date;
                                setDate(currentDate);
                            }}
                        />
                    </View>

                    <View style={styles.datePickerContainer}>
                        <Text>Select Time:</Text>
                        <DateTimePicker
                            value={time}
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                                const currentTime = selectedTime || time;
                                setTime(currentTime);
                            }}
                        />
                    </View>

                    <Text style={styles.dateTimeDisplay}>
                        Selected Date and Time: {displayFormattedDateTime}
                    </Text>

                    <TextInput
                        style={[styles.inputField, { height: 100 }]}
                        placeholder="Description"
                        onChangeText={newText => setDescription(newText)}
                        value={description}
                        multiline={true}
                    />

                    <View style={styles.holeInputContainer}>
                        <TextInput
                            style={styles.holeInput}
                            placeholder="Hole Number"
                            keyboardType="numeric"
                            onChangeText={setHoleNumber}
                            value={holeNumber}
                        />
                        <TextInput
                            style={styles.holeInput}
                            placeholder="Par"
                            keyboardType="numeric"
                            onChangeText={setPar}
                            value={par}
                        />
                        <TextInput
                            style={styles.holeInput}
                            placeholder="Distance (yards)"
                            keyboardType="numeric"
                            onChangeText={setDistance}
                            value={distance}
                        />
                        <TextInput
                            style={styles.holeInput}
                            placeholder="Hole Image URL"
                            onChangeText={setHoleImage}
                            value={holeImage}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addHole}>
                            <Text style={styles.addButtonText}>Add Hole</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={holes}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.holeListItem}>
                                <Text>Hole {item.holeNumber}: Par {item.par}, Distance: {item.distance} yards</Text>
                                <Image source={{ uri: item.holeImage }} style={styles.holeImage} />
                            </View>
                        )}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleCreation}>
                        <Text style={styles.buttonText}>Create Competition</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        height: 1100,
    },
    inputField: {
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 15,
        padding: 10
    },
    button: {
        backgroundColor: "green",
        textAlign: 'center',
        padding: 15,
        marginTop: 30
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
    datePickerContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    dateTimeDisplay: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold'
    },
    holeInputContainer: {
        flexDirection: 'column',
        marginTop: 20
    },
    holeInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 5
    },
    addButton: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 10
    },
    addButtonText: {
        color: 'white'
    },
    holeListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    holeImage: {
        width: 50,
        height: 50,
        marginLeft: 10
    }
});
