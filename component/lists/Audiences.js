import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Colors, IconButton } from 'react-native-paper'
import { formatDayName, formatReadedDateTime } from '../../services/Converter'
import { useNavigation } from '@react-navigation/native'

const Audiences = (props) => {

    const [audiencesData, setAudiencesData] = useState([])

    useEffect(() => {
        let isMounted =  true
        if(isMounted){
            setAudiencesData(props.audiencedata)
        }
        return () => {isMounted = false}
    }, [])

    return (
        <View style={styles.boxAudiences}>
            <FlatList data={audiencesData} renderItem={({item}) => (<Audience audiencedata={item} blockdata={props?.blockdata} />)} />
        </View>
    )    
}

export const Audience = (props) => {

    const navigation = useNavigation();

    function gotoDetail(){
        navigation.navigate("DetailAudience", {blockdata: props?.blockdata, audiencedata: props?.audiencedata});
    }

    return (
        <TouchableOpacity style={styles.boxAudience} onPress={() => gotoDetail()}>
            <Text style={styles.eventTtile}>{props.audiencedata?.event.event_name.split(" ").splice(0,4).join(" ")}</Text>
            <View style={styles.boxAudienceInfo}>
                <View>
                <Text>Mulai : {formatDayName(props.audiencedata?.event.start_date)}, {formatReadedDateTime(props.audiencedata?.event.start_date)}</Text>
                    <Text>Selesai : {formatDayName(props.audiencedata?.event.end_date)}, {formatReadedDateTime(props.audiencedata?.event.end_date)}</Text>
                </View>
                <View style={styles.checkBox}>
                    <IconButton icon='check-bold' color={Colors.green400}/>
                </View>
            </View>
            <View style={styles.statusBox}>
                <View style={styles.statusText}><Text>Kadaluarsa</Text></View>
                <View style={styles.iconBox}>
                    <IconButton icon='alarm-check' color={props.audiencedata?.event.take_time ? Colors.red900 : Colors.grey600}/>
                    <IconButton icon='map-marker' color={props.audiencedata?.event.take_location ? Colors.red900 : Colors.grey600}/>
                    <IconButton icon='camera' color={props.audiencedata?.event.take_photo ? Colors.red900 : Colors.grey600}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    boxAudiences:{
        paddingHorizontal: 7
    },
    boxAudience:{
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
    boxAudienceInfo:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkBox:{
        
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
    }
})


export { Audiences }