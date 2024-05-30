import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { createNewBucketItem } from '../services/DbService'
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Alert } from 'react-native';

const CreateScreen = ({ navigation }) => {

    const [title, setTitle] = useState('')
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())

    const handleCreation = async () => {
        const combinedDateTime = new Date(date);
        combinedDateTime.setHours(time.getHours());
        combinedDateTime.setMinutes(time.getMinutes());

        if (!title.trim() || !date || !time) {
            Alert.alert("Validation Error", "Please enter all required fields.");
            return;
        }

        const formattedDateTime = format(combinedDateTime, 'EEEE, MMMM d, yyyy h:mm a');

        const Competetion = {
            title,
            date: formattedDateTime
        }

        const success = await createNewBucketItem(Competetion)

        if (success) {
            navigation.goBack()
        } else {
            console.error("Failed to create bucket list item")
        }
    }

    const displayFormattedDateTime = format(date, 'EEEE, MMMM d, yyyy') + ' at ' + format(time, 'h:mm a');

    return (
        <SafeAreaView>
            <View style={styles.container}>

                <TextInput
                    style={styles.inputField}
                    placeholder="Bucket List Title"
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

                <TouchableOpacity style={styles.button} onPress={handleCreation}>
                    <Text style={styles.buttonText}>Create Bucket List Item</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

export default CreateScreen

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
    }
})
