import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, ToastAndroid, FlatList, TouchableOpacity} from 'react-native'
import { Colors, IconButton } from 'react-native-paper'
import { formatReadedDateTime, formatDayName } from '../../services/Converter'
import { useNavigation } from '@react-navigation/native'
import * as Clipboard from 'expo-clipboard';
import { ToastLongBottom } from '../tools/Messages'

const Events = (props) => {

    const [eventsData, setEventsData] = useState([])

    useEffect(() => {
        let isMounted = true
        if(isMounted){
            setEventsData(props?.eventsdata)
        }
        return () => {isMounted = false}
    },[props?.eventsdata])    

    return (
        <View style={styles.boxEvents}>
            <FlatList data={eventsData} renderItem={({item}) => (<Event eventdata={item} blockdata={props?.blockdata}  />)} />
        </View>
    )    
}

export const Event = (props) => {

    const navigation = useNavigation();

    function gotoDetail(){
        navigation.navigate("DetailEvent", {blockdata: props?.blockdata, eventdata: props?.eventdata});
    }

    function copyEventToken(){
        ToastLongBottom("Event token copied...")
        try{
            Clipboard.setString(props.eventdata?.token)
        }catch(error){
            console.log(error)
        }
    }

    return (
        <TouchableOpacity style={styles.boxEvent} onPress={() => gotoDetail()} onLongPress={() => copyEventToken()} key={props.eventdata?.id}>
            <Text style={styles.eventTtile}>{props.eventdata?.event_name}</Text>
            <View style={styles.boxEventInfo}>
                <View>
                    <Text>Mulai : {formatDayName(props.eventdata?.start_date)}, {formatReadedDateTime(props.eventdata?.start_date)}</Text>
                    <Text>Selesai : {formatDayName(props.eventdata?.end_date)}, {formatReadedDateTime(props.eventdata?.end_date)}</Text>
                </View>
                <View style={styles.checkBox}>
                    <Text style={styles.audienceCount}>1000</Text>
                </View>
            </View>
            <View style={styles.statusBox}>
                <View style={styles.statusText}><Text style={styles.eventToken}>{props.eventdata?.token}</Text></View>
                <View style={styles.iconBox}>
                    <IconButton icon='alarm-check' color={props.eventdata?.take_time ? Colors.red900 : Colors.grey600}/>
                    <IconButton icon='map-marker' color={props.eventdata?.take_location ? Colors.red900 : Colors.grey600}/>
                    <IconButton icon='camera' color={props.eventdata?.take_photo ? Colors.red900 : Colors.grey600}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default Events

const styles = StyleSheet.create({
    boxEvents:{
        paddingHorizontal: 7
    },
    boxEvent:{
        marginVertical: 5,
        backgroundColor: "#eeeeee",
        height: 130,
        padding: 10,
        borderRadius: 3
    },
    eventTtile:{
        fontWeight: 'bold',
        fontSize: 16
    },
    boxEventInfo:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkBox:{
        padding:10,
        marginBottom: 5
    },
    audienceCount:{
        fontWeight: 'bold'
    },
    statusBox:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#dddddd'
    },
    iconBox:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusText:{
        padding: 10
    },
    eventToken:{
        fontWeight: 'bold'
    }
})