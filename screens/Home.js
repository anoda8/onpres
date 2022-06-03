import React, { useEffect, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { FAB } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from '../component/home/Header'
import { HorizonMenu } from '../component/home/HorizonMenu'
import { EventsBox } from '../component/home/EventsBox'
import { AudienceBox } from '../component/home/AudienceBox'
import * as SecureStore from 'expo-secure-store'
import { getUserData } from '../services/Userdata';
import axios from 'axios'
import {CallApi} from '../services/ApiService'

export default function Home({route, navigation}){

  const [userData, setUserData] = useState([])
  const [jwtToken, setJwtToken] = useState(null)
  const [defShow, setDefShow] = useState(false)
  const [blockData, setBlockData] = useState([])
  const [eventsData, setEventsData] = useState([])
  const [audiencesData, setAudiencesData] = useState([])
  const [buttonReload, setButtonReload] = useState(false)

  useEffect(async () => {
    let isMounted = true
    if(isMounted){
      await getJwtToken();
      setUserData(await getUserData);
    }    
    return () => {isMounted = false}
  },[])

  useEffect(() => {
    let isMounted = true
    if((jwtToken != null) && (userData != [])){
      if(isMounted){
        getAudiences()
        getEvents()
        setBlockData({jwt: jwtToken, userDt: userData})
      } 
    }  
    return () => {isMounted = false}
  },[userData])

  useEffect(() => {
    let isMounted = true
    if(route.params?.triggerUpdate == true){
      getAudiences()
      getEvents()
    }
    return () => {isMounted = false}
  }, [route.params?.triggerUpdate])

  async function getJwtToken() {
    let jwt = null;
    try{
        jwt = await SecureStore.getItemAsync('jwtToken');
    }catch(error){
        console.log(error)
    }
    setJwtToken(jwt)
    return jwt;
  }

  const addTools = () => {
      if(defShow){
        navigation.navigate("AddAudiences", blockData);
      }else{
        navigation.navigate("AddEvents", blockData);
      }
  }

  const getAudiences = () => {
      if(jwtToken != null){
        axios.create({
          baseURL: CallApi.base_url,
          headers: {
              "Content-Type" : "application/json",
              "Authorization" : `Bearer ${jwtToken}`
          }
        }).get(`homeaudiences/${userData.id}`).then(response => {
          setAudiencesData(response.data)
          // console.log(response.data)
        }).catch(error =>{
            console.log(error.response.data);
        });     
      }
         
  }

  const getEvents = () => {
    if(jwtToken != null){
      axios.create({
        baseURL: CallApi.base_url,
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${jwtToken}`
        }
      }).get(`homeevents/${userData.id}`).then(response => {
          setEventsData(response.data)
      }).catch(error =>{
          console.log(error);
      });
    }      
  }

  const procDefShow = (stat) =>{
    getAudiences();
    getEvents();
    setDefShow(stat);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header userdata={userData} />
      <HorizonMenu onPress={() => navigation.navigate("Settings")} />
      {defShow ? (audiencesData && <AudienceBox jwttoken={jwtToken} blockdata={blockData} objdata={audiencesData} />) : (eventsData && <EventsBox jwttoken={jwtToken} blockdata={blockData} objdata={eventsData} />)}
      <View style={styles.taskSelection}>
          <TouchableOpacity style={{...styles.taskButton, backgroundColor: '#D8B6A4'}} onPress={() => procDefShow(true)}>
              <Text style={{...styles.taskButtonText, color:'black'}}>Audience</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.taskButton, backgroundColor: '#640101'}} onPress={() => procDefShow(false)}>
              <Text style={{...styles.taskButtonText, color:'white'}}>Events</Text>
          </TouchableOpacity>
      </View>
      <FAB medium icon='plus' style={{ ...styles.fab, backgroundColor: defShow ?  '#D8B6A4' :  '#640101' }} onPress={addTools} />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container:{
      padding:15,
      flex: 1
  },
  taskSelection:{
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-between'
  },
  taskButton:{
      width: 180,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 5
  },
  taskButtonText:{
      fontWeight: 'bold',
      fontSize: 16,
  },
  fab:{
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      
  }
})