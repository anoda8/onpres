import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { TextInput, Switch, Button } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatDate, formatTime, formatDateTime, formatUnix} from '../services/Converter';
import {useInputDate, useInputTime} from '../services/DTPicker';
import * as Updates from 'expo-updates';
// import {AdMobBanner} from 'expo-ads-admob';
// import {bannerId} from '../services/Ads';
import axios from 'axios';
import { CallApi } from '../services/ApiService';

const AddEvents = ({route, navigation}) => {

    const [eventName, setEventName] = useState(null);
    const [description, setDescription] = useState(null);

    const [hostToken, setHostToken] = useState('');
    const [userData, setUserData] = useState(null)
    const [jwtToken, setJwtToken] = useState(null)

    const [timeLimit, setTimeLimit] = useState(false);
    const [collectLoc, setCollectLoc] = useState(false);
    const [collectPhoto, setCollectPhoto] = useState(false);

    const switchTimeLimit = () => setTimeLimit(!timeLimit);
    const switchCollectLoc = () => setCollectLoc(!collectLoc);
    const switchCollectPhoto = () => setCollectPhoto(!collectPhoto);

    const startDate = useInputDate(new Date());
    const startTime = useInputTime(new Date());
    const endDate = useInputDate(new Date());
    const endTime = useInputTime(new Date());
    
    useEffect(() => {
        let isMounted = true
        if(isMounted) {
            setUserData(route.params?.userDt)
            setJwtToken(route.params?.jwt)
        }
        return () => {isMounted = false}
    }, [route.params?.userDt])
    
    useEffect(() => {
        let isMounted = true
        if(isMounted) {
            getToken(7)
        }
        return () => {isMounted = false}
    }, [])
    
    async function getToken(length){
        await axios.get(`http://random.anoda.web.id?length=${length}`).then(response => {
            setHostToken(response.data.random);
        }).catch(error => console.log(error));
    }

    async function saveEvents(){
        const start = formatDateTime(startDate.date, startTime.date);
        const end = formatDateTime(endDate.date, endTime.date);

        if(eventName == null){
            alert("You must fill the Event Name");
            return;
        }

        if(description == null){
            alert("You must fill the Description");
            return;
        }
        
        if(formatUnix(start) > formatUnix(end)){
            alert('Wrong date range');
            return;
        }
        if(formatUnix(start) === formatUnix(end)){
            alert('End date should be more than start');
            return;
        }

        let data = {
            event_name: eventName,
            take_photo: collectPhoto,
            take_location: collectLoc,
            take_time: timeLimit,
            end_date: end,
            start_date: start,
            notes: description,
            token: hostToken,
            user_id: userData.id,
        };

        // console.log(user);

        axios.create({
            baseURL: CallApi.base_url,
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${jwtToken}`
            }
        }).post('events', data).then(response => {
            navigation.navigate("Home", {triggerUpdate: false})
        }).catch(error =>{
            console.log(error.response);
        });

        return () => {}
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.tokenBox}>
                <Text style={styles.tokenText}>Token : {hostToken}</Text>
            </View>
            <TextInput style={styles.textInput} label='Judul' placeholder='Masukkan judul acara' onChangeText={text => setEventName(text)} />
            <TextInput style={styles.textInput} label='Deskripsi' placeholder='Masukkan deskripsi acara' multiline={true} onChangeText={text => setDescription(text)} />
            <View style={styles.inputDateTime}>
                <TextInput style={styles.inputDate} label="Tanggal Mulai" mode="outlined" value={formatDate(startDate.date)} editable={false} right={<TextInput.Icon name="calendar-text-outline" onPress={startDate.showDatePicker} />} />
                {startDate.show && (
                    <DateTimePicker testID="startDate" value={startDate.date} mode={startDate.mode} is24Hour={true} display="default" onChange={startDate.onChange} />
                )}
                <TextInput style={styles.inputTime} label="Waktu Mulai" mode="outlined" value={formatTime(startTime.date)} editable={false} right={<TextInput.Icon name="clock-outline" onPress={startTime.showDatePicker} />} />
                {startTime.show && (
                    <DateTimePicker testID="startTime" value={startTime.date} mode={startTime.mode} is24Hour={true} display="default" onChange={startTime.onChange} />
                )}
            </View>
            <View style={styles.inputDateTime}>
                <TextInput style={styles.inputDate} label="Tanggal Selesai" mode="outlined" value={formatDate(endDate.date)} editable={false} right={<TextInput.Icon name="calendar-text-outline" onPress={endDate.showDatePicker} />} />
                {endDate.show && (
                    <DateTimePicker testID="endDate" value={endDate.date} mode={endDate.mode} is24Hour={true} display="default" onChange={endDate.onChange} />
                )}
                <TextInput style={styles.inputTime} label="Waktu Selesai" mode="outlined" value={formatTime(endTime.date)} editable={false} right={<TextInput.Icon name="clock-outline" onPress={endTime.showDatePicker} />} />
                {endTime.show && (
                    <DateTimePicker testID="endTime" value={endTime.date} mode={endTime.mode} is24Hour={true} display="default" onChange={endTime.onChange} />
                )}
            </View>
            <View style={{...styles.switchBox, backgroundColor: (timeLimit ?'#fea82f' : '#AFAFAF')}}>
                <Text style={{ marginLeft: 10, marginTop: 12 }}>Batasi waktu presensi</Text>
                <Switch value={timeLimit} onValueChange={switchTimeLimit} color="green" />
            </View>
            <View style={{...styles.switchBox, backgroundColor: (collectLoc ?'#fea82f' : '#AFAFAF')}}>
                <Text style={{ marginLeft: 10, marginTop: 12 }}>Ambil lokasi peserta</Text>
                <Switch value={collectLoc} onValueChange={switchCollectLoc} color="green" />
            </View>
            <View style={{...styles.switchBox, backgroundColor: (collectPhoto ?'#fea82f' : '#AFAFAF')}}>
                <Text style={{ marginLeft: 10, marginTop: 12 }}>Ambil foto peserta</Text>
                <Switch value={collectPhoto} onValueChange={switchCollectPhoto} color="green" />
            </View>
            <View style={styles.buttonBox}>
                <Button mode="contained" style={{ borderRadius: 5, marginRight: 10}} icon="arrow-left" onPress={() => navigation.goBack()}>Kembali</Button>
                <Button mode="contained" style={{ borderRadius: 5, marginRight: 10}} icon="zip-disk" onPress={() => saveEvents()}>Simpan</Button>
            </View>
        </ScrollView>
    )
}

export default AddEvents

const styles = StyleSheet.create({
    container:{
        padding: 10
    },
    tokenBox:{
        flex: 1,
        backgroundColor: "#640101",
        padding: 10,
        borderRadius: 10
    },
    tokenText:{
        color: "#ffffff",
        fontWeight: 'bold',
        fontSize: 17
    },
    textInput:{
        marginTop: 20
    },
    inputDateTime:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    inputDate:{
        width: '50%'
    },
    inputDate:{
        width: '50%'
    },
    inputTime:{
        width: '48%'
    },
    switchBox:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        borderRadius: 5,
        marginTop: 20
    },
    buttonBox:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20
    }
})
