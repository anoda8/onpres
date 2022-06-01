import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { IconButton, Colors, FAB, ActivityIndicator } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { formatReadedDateTime } from '../services/Converter'
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { CallApi } from '../services/ApiService'
import moment from 'moment';
import axios from 'axios';
import { ToastPresenceShort, ConfirmationMessage } from '../services/Tools'

const DetailAudience = ({route, navigation}) => {

  const [audience, setAudience] = useState([])
  const [jwtToken, setJwtToken] = useState(null)
  const [userData, setUserData] = useState([])
  const [location, setLocation] = useState(null)
  const [curtime, setCurtime] = useState('')
  const [pictureUri, setPictureUri] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    let isMounted = true
    if(isMounted){
      navigation.setOptions({title: "Audience Detail"})
      setAudience(route.params?.audiencedata)
      setUserData(route.params?.blockdata.userDt)
      setJwtToken(route.params?.blockdata.jwt)
    }
    return () => {isMounted = false}
  },[])

  useEffect(() => {
    let isMounted = true
    if(isMounted){
      (async ()=> {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            alert('Sorry, we need location permission');
        }
        let locate = await Location.getCurrentPositionAsync();
        setLocation(locate);
      })();
    }
    return () => {isMounted = false}
  },[])

  useEffect(() => {
    let timer = setInterval(() => {
        setCurtime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => {
        clearInterval(timer);
    }
  }, []);
  
  const pickImage = async () => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if(status !== 'granted'){
        alert('Sorry, we need camera permission to take picture');
        return;
    }
    try{
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4,3],
        quality: 0.1,
        base64: false
      });
      
      if(!result.cancelled){
        setPictureUri(result.uri);
      }
    }catch(error){
      console.log(error)
    }    
  }

  const doUpload = async (inputData) => {
    setUploadLoading(true);
    let image = {
      uri: pictureUri,
      type: 'image/*',
      name: moment().unix() + '.' + pictureUri.split('.').pop()
    }; 

    const FormData = global.FormData;
    const data = new FormData();
    data.append('file', image);
    var config = {
      method: 'POST',
      headers: {
        // "Content-Type" : "multipart/form-data; charset=utf-8; boundary=" + Math.random().toString().substring(2),
        "Content-Type" : "multipart/form-data;",
        "Authorization" : `Bearer ${jwtToken}`,
        'Accept': 'application/json',
      },
      body: data
    }

    await fetch(CallApi.base_url+'audience-upload', config).then((response) => {
      return response.text();
    }).then(response => {
      setUploadedImage(response);
      setUploadLoading(false);
      if(response !== null){
        ToastPresenceShort("foto berhasil terupload");
      }else{
        ToastPresenceShort("gagal mengupload foto");
      }
    }).catch(error => {
      console.log(error.status);
    });
  }

  const saveData = (inputData) => {
    setSaveLoading(true);
    axios.create({
      baseURL: CallApi.base_url,
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${jwtToken}`
      }
    }).post(`audiences`, inputData).then(response => {
      console.log(response.data);
      setSaveLoading(false);
    }).catch(error => {
      console.log(error.response);
    });
  }

  const saveAudience = () => {
    if(audience.take_photo !== null){
      doUpload(data);
    }
    let data = {
      'entry_date':moment().format('YYYY-MM-DD'),
      'latitude':location.latitude,
      'longitude':location.longitude,
      'saved':1,
      'user_id': userData.id,
      'events_id': audience.events_id,
      'token': audience.token,
      'photoUrl': uploadedImage
    }
    saveData(data);
  }
  
  const confirmSave = () => ConfirmationMessage("Konfirmasi Simpan","Apakah anda yakin akan mengirimkan data presensi anda ini?", saveAudience());

  return (
    <View style={styles.container}>
      <ScrollView style={styles.containerScroll}>
          <Text style={styles.judulEvent}>{audience.event?.event_name}</Text>
          <Text style={styles.author}>Dibuat oleh : {audience.user?.name}</Text>
          <Text style={styles.author}>Email : {audience.user?.email}</Text>
          <View style={styles.jadwal}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5}}>Mulai : {formatReadedDateTime(audience.event?.start_date)}</Text>
              <Text style={{ fontWeight: 'bold' }}>Selesai : {formatReadedDateTime(audience.event?.end_date)}</Text>
          </View>
          <View style={{ padding: 10 }}>                    
            <View style={styles.headline}>
                <Text>Lokasi Anda</Text>
                <IconButton icon="map-marker" style={{ margin: 0 }} color={(audience.event?.take_location && (audience?.entry_date === null)) ? Colors.red500 : Colors.grey400} size={25}/>
            </View>
            <View style={styles.line} />
            {location && <MapView style={styles.map} initialRegion={{ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.03, longitudeDelta: 0.04 }}>
            <Marker coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}}/>
            </MapView>}
            <View style={styles.headline}>
                <Text style={{ flex: 1, marginTop: 5 }}>Waktu Presensi</Text>
                <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{audience?.entry_date !== null ? formatReadedDateTime(audience?.entry_date) : curtime }</Text>
                <IconButton icon="alarm-check" style={{ margin: 0 }} color={(audience.event?.take_time && (audience?.entry_date === null)) ? Colors.red500 : Colors.grey400} size={25}/>
            </View>
            <View style={styles.line} />
            <View style={styles.headline}>
                <Text style={{ flex: 1, marginTop: 5}}>Foto</Text>
                <IconButton icon="camera" style={{ margin: 0 }} color={(audience.event?.take_photo && (audience?.entry_date === null)) ? Colors.red500 : Colors.grey400} size={25} onPress={() => {
                    if((audience.event?.take_photo && (audience?.entry_date === null))){
                        pickImage()
                    }else{
                        if(event?.entry_date === null){
                            alert("Tidak mengumpulkan foto.");
                        }else{
                            alert("Foto sudah terupload.");
                        }                                
                    }                            
                }}/>
            </View>
            <View style={styles.line} />
            {pictureUri && <View style={styles.pictureBox}>
              <Image source={{ uri: pictureUri }} style={styles.picture} />
            </View>}            
          </View>
          {uploadLoading && <ActivityIndicator size='large' />}
          {saveLoading && <ActivityIndicator size='large' />}
      </ScrollView>
        {!audience.saved && <FAB style={styles.fab} small icon="content-save" label="Simpan" animated={true} onPress={() => saveAudience()} /> }
    </View>
  )
}

export default DetailAudience

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 10
  },
  containerScroll:{
    padding: 10
  },
  map: {
      // width: Dimensions.get('window').width,
      height: 300,
  },
  headline:{
      padding: 7,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 45,
      backgroundColor: '#B3A89F',
      marginTop: 5
  },
  line:{
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      height: 1,
      alignSelf: 'stretch'
  },
  fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: '#fea82f'
  },
  judulEvent:{
      padding: 10,
      fontWeight: 'bold',
      fontSize: 17
  },
  foto:{
      width: 300,
      height: (300/3)*4, 
  },
  imageBox:{
      flex:1,
      alignItems: 'center',
      height: '100%',
      padding: 20
  },
  jadwal:{
      padding: 10,
      backgroundColor: '#ffc288',
      margin: 10
  },
  author: {
      marginLeft: 10,
      fontStyle: 'italic'
  },
  pictureBox:{
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 100
  },
  picture:{
    width: 200, 
    height: 200
  }
})
