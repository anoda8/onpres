import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import axios from 'axios'
import { CallApi } from '../services/ApiService'
import { Event } from '../component/lists/Events'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'
import { ToastLongBottom } from '../component/tools/Messages'

const ListEvents = (props) => {

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [nextPageUrl, setNextPageUrl] = useState(null)

  useEffect(() => {
    let isMounted = true
    if(isMounted) {
       props.navigation.setOptions({title: "Events list"})
       listEvents()
    }
    return () =>  {isMounted = false}
  },[])

  const listEvents = async () => {
    setLoading(true)
    axios.create({
        baseURL: CallApi.base_url,
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${props.route.params.blockdata?.jwt}`
        }
    }).get(`events`).then(response => {
        setEvents(response.data.data)
        setNextPageUrl(response.data.next_page_url)
        // console.log(response.data)
        setLoading(false)
    }).catch(error =>{
        console.log(error);
    });
  }

  const loadMore = async () => {
    setLoading(true)
    if(nextPageUrl != null){
      axios.create({
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${props.route.params.blockdata?.jwt}`
        }
      }).get(nextPageUrl).then(response => {
        if(response.data.data.length > 0){
          setEvents([...events, ...response.data.data])
          setNextPageUrl(response.data.next_page_url)
          setLoading(false)
        }      
      });
    }else{
      ToastLongBottom("No more page to load..")
      setLoading(false)
    }    
  }

  return (
    <View style={styles.container}>
      <FlatList data={events} renderItem={({item}) => (<Event eventdata={item} blockdata={props.route.params.blockdata}  />)} onEndReached={loadMore} onEndReachedThreshold={0.5} />
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#000000" animating={loading} />
      </View>
    </View>
  )
}

export default ListEvents

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  loading:{
    bottom: 100
  }
})