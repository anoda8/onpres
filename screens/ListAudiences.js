import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'
import axios from 'axios'
import { CallApi } from '../services/ApiService'
import { Audience } from '../component/lists/Audiences'
import { ToastLongBottom } from '../component/tools/Messages'

const ListAudiences = (props) => {

  const [audiences, setAudiences] = useState([])
  const [loading, setLoading] = useState(false)
  const [nextPageUrl, setNextPageUrl] = useState(null)

  useEffect(() => {
    let isMounted = true
    if(isMounted) {
       props.navigation.setOptions({title: "Audiences list"})
       listAudiences()
    }
    return () =>  {isMounted = false}
  },[])

  const listAudiences = async () => {
    setLoading(true)
    axios.create({
      baseURL: CallApi.base_url,
      headers: {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${props.route.params.blockdata?.jwt}`
      }
    }).get(`audiences`).then(response => {
        setAudiences(response.data.data)
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
          setAudiences([...events, ...response.data.data])
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
      <FlatList data={audiences} renderItem={({item}) => (<Audience audiencedata={item} blockdata={props.route.params.blockdata}  />)} onEndReached={loadMore} onEndReachedThreshold={0.5} />
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#000000" animating={loading} />
      </View>
    </View>
  )
}

export default ListAudiences

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  loading:{
    bottom: 100
  }
})