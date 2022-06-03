import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { TextInput, Divider } from 'react-native-paper'
import * as Clipboard from 'expo-clipboard';
import { CallApi } from '../services/ApiService';
import axios from 'axios';
import { formatDayName, formatReadedDateTime } from '../services/Converter';
import * as Updates from 'expo-updates';

const AddAudiences = (props) => {

    const [eventToken, setEventToken] = useState(null)
    const [eventFound, setEventFound] = useState([])

    useEffect(async () => {
        let isMounted = true
        if(isMounted){
            const text = await Clipboard.getStringAsync()
            if(text.length == 7){
                setEventToken(text)
            }
        }
        return () => {isMounted = false}
    }, [])

    useEffect(() => {
        let isMounted = true
        if(isMounted){
           getEvent()
        }
        return () => {isMounted = false}
    }, [eventToken])

    async function getEvent(){
        axios.create({
            baseURL: CallApi.base_url,
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${props.route.params?.jwt}`
            }
        }).get(`events_token/${eventToken}`).then(response => {
            setEventFound(response.data)
            // console.log(response.data)
        }).catch(error =>{
            console.log(error);
        });
    }

    function saveEvent(){

        let data = {
            token: eventFound?.token,
            user_id: props.route.params?.userDt.id,
            events_id: eventFound?.id,
        }

        // console.log(data);

        axios.create({
            baseURL: CallApi.base_url,
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${props.route.params?.jwt}`
            }
        }).post(`audiences`, data).then(response => {
            // console.log(response.data)
            // navigation.navigate("Home", {triggerUpdate: true});
            Updates.reloadAsync();
        }).catch(error =>{
            console.log(error);
        });
    }

    function confirmSaveEvent(){
        Alert.alert("Save Event", "Are you sure want to save the Event ?",[
            {
                text: "Cancel",
                onPress: () => {return},
                style: 'cancel'
            },
            {
                text: "Save",
                onPress: () => saveEvent(),
                style: 'default'
            }
        ])
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} label='Search Event Token' placeholder='Search Event Token' value={eventToken} onChangeText={text => setEventToken(text)} />
            {(Object.keys(eventFound).length > 0) && 
                <View>
                    <Text style={styles.foundMessage}>Found an event...</Text>
                    <TouchableOpacity style={styles.eventFoundBox} onPress={() => confirmSaveEvent()}>
                        <Text style={styles.eventFoundTitle}>{eventFound?.event_name}</Text>
                        <Text style={styles.eventFoundDate}>Start Date : {formatDayName(eventFound?.start_date)}, {formatReadedDateTime(eventFound?.start_date)}</Text>
                        <Text style={styles.eventFoundDate}>End Date : {formatDayName(eventFound?.end_date)}, {formatReadedDateTime(eventFound?.end_date)}</Text>
                        <Text style={styles.eventFoundDate}>Token : {eventFound?.token}</Text>
                        <View style={styles.boxIcon}>

                        </View>
                        <Divider style={styles.space} />
                        <Text style={styles.eventFoundAuthor}>Author Name : {eventFound?.author.name}</Text>
                        <Text style={styles.eventFoundAuthor}>Author Email : {eventFound?.author.email}</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default AddAudiences

const styles = StyleSheet.create({
    container:{
        padding: 10
    },
    eventFoundBox:{
        marginTop: 10,
        backgroundColor: "#D8B6A4",
        padding: 10,
        borderRadius: 10
    },
    boxIcon:{
        flexDirection: 'row'
    },
    eventFoundTitle:{
        fontWeight: 'bold',
        fontSize: 16
    },
    eventFoundDate:{

    },
    eventFoundAuthor:{
        fontStyle: 'italic'
    },
    space:{
        marginVertical: 10
    },
    foundMessage:{
        marginTop: 10,
        fontStyle: 'italic'
    }
})