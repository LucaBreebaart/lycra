import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import { createNewBucketItem, createNewHoleItem } from '../services/DbService';
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
    const [holeImage, setHoleImage] = useState('https://www.rockyrivergolf.com/wp-content/uploads/sites/8088/2021/04/1.png');

    const handleCreation = async () => {
        const combinedDateTime = new Date(date);
        combinedDateTime.setHours(time.getHours());
        combinedDateTime.setMinutes(time.getMinutes());

        if (!title.trim() || !date || !time || holes.length === 0) {
            Alert.alert("Validation Error", "Please enter all required fields.");
            return;
        }

        const formattedDateTime = format(combinedDateTime, 'EEEE, MMMM d, yyyy h:mm a');

        const Competition = {
            title,
            date: formattedDateTime
        };

        const success = await createNewBucketItem(Competition);

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
        if (!holeNumber || !par) {
            Alert.alert("Validation Error", "Please enter both hole number and par.");
            return;
        }
        setHoles([...holes, { holeNumber, par, holeImage }]);
        setHoleNumber('');
        setPar('');
    };

    const displayFormattedDateTime = format(date, 'EEEE, MMMM d, yyyy') + ' at ' + format(time, 'h:mm a');

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <TextInput
                    style={styles.inputField}
                    placeholder="Competition Title"
                    onChangeText={newText => setTitle(newText)}
                    defaultValue={title}
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
                    <TouchableOpacity style={styles.addButton} onPress={addHole}>
                        <Text style={styles.addButtonText}>Add Hole</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={holes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.holeListItem}>
                            <Text>Hole {item.holeNumber}: Par {item.par}</Text>
                            <Image source={{ uri: item.holeImage }} style={styles.holeImage} />
                        </View>
                    )}
                />

                <TouchableOpacity style={styles.button} onPress={handleCreation}>
                    <Text style={styles.buttonText}>Create Competition</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CreateScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    holeInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: '40%'
    },
    addButton: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
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
