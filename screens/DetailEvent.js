import { StyleSheet, Text, View, SafeAreaView} from 'react-native'
import { IconButton, Colors, Button} from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import {formatReadedDateTime, formatDate, formatTime} from '../services/Converter';
import axios from 'axios';
import {CallApi} from '../services/ApiService';

const DetailEvent = ({route, navigation}) => {

  // const {navigation} = props;
  const [postEvent, setPostEvent] = useState([]);
  const [event, setEvent] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    let isMounted = true
    if(isMounted){
      navigation.setOptions({title: "Event Detail"});
      setPostEvent(route.params?.eventdata);
      setUserData(route.params?.blockdata.userDt);
      setJwtToken(route.params?.blockdata.jwt);
    }
    return () => {isMounted = false}
  },[]);

  useEffect(() => {
    let isMounted = true
    if(isMounted){
      if(jwtToken != null){
        getEvent();
      }
    }
    return () => {isMounted = false}
  }, [jwtToken])
  
  const getEvent = () => {
      axios.create({
        baseURL: CallApi.base_url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        }
      }).get(`events/${postEvent?.id}`).then(response => {
        setEvent(response.data);
        setAudiences(response.data.audiences);
        // console.log(response.data);
      }).catch(error => {
        console.log(error);
      });
  }

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
            <Text style={{ fontWeight: 'bold' }}>{audiences.length}</Text>
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
      <Button icon='file-download' mode='contained' uppercase={false} style={styles.downloadButton} >Unduh Report</Button>
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
     }, 
     downloadButton:{
       marginHorizontal: 10,
     }
})
