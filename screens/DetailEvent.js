import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import {formatReadedDateTime, formatDate, formatTime} from '../services/Converter';

const DetailEvent = ({route, navigation}) => {

  // const {navigation} = props;
  const [event, setEvent] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    let isMounted = true
    if(isMounted){
      navigation.setOptions({title: "Event Detail"});
      setEvent(route.params?.eventdata);
      setUserData(route.params?.blockdata.userDt);
      setJwtToken(route.params?.blockdata.jwt);
    }
    return () => {isMounted = false}
  },[]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.eventBox}>
        <Text style={styles.judul}>{event.event_name}</Text>
        <View style={styles.eventAudienceDate}>
          <View>
              <Text style={{ fontWeight: 'bold' }}>Mulai : {formatReadedDateTime(event.start_date)}</Text>
              <Text style={{ fontWeight: 'bold' }}>Selesai : {formatReadedDateTime(event.end_date)}</Text>
          </View>
          <View style={styles.counter}>
            <Text>Peserta Hadir</Text>
            <Text style={{ fontWeight: 'bold' }}>{event.audiences.length}</Text>
          </View>
        </View>
        <View style={styles.iconStatusButton}>
          <View style={styles.iconStatus}>
            <IconButton icon='alarm-check' color={event.take_time ? Colors.red500 : Colors.grey400} />
            <IconButton icon='map-marker' color={event.take_location ? Colors.red500 : Colors.grey400} />
            <IconButton icon='camera' color={event.take_photo ? Colors.red500 : Colors.grey400} />
          </View>
          <View>
             <IconButton icon='power' color={Colors.black} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default DetailEvent

const styles = StyleSheet.create({
   container: {
      padding: 10,
       flex: 1
     },
     eventBox: {
       padding: 10,
       margin: 10,
       backgroundColor: '#B3A89F',
       elevation: 5
     },
     judul: {
       fontWeight: 'bold',
       fontSize: 18,
       borderBottomColor: '#000000',
       borderBottomWidth: 1
     },
     eventAudienceDate: {
       marginTop: 10,
       flexDirection: 'row',
       justifyContent: 'space-between'
     },
     counter: {
       alignItems: 'center'
     },
     iconStatusButton: {
       flexDirection: 'row',
       justifyContent: 'space-between'
     },
     iconStatus: {
       flexDirection: 'row'
     },
     audienceImage: {
       width: 100,
       height: 100
     },
     audienceBox: {
       padding: 10,
       marginHorizontal: 10,
       marginVertical: 5,
       elevation: 10,
       backgroundColor: '#ffffff',
       flexDirection: 'row',
       borderRadius: 3
     },
     infoBox: {
       marginLeft: 10
     },
     timeButtonBox: {
       flex: 1,
       justifyContent: 'flex-end'
     }
})
