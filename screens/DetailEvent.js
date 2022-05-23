import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const DetailEvent = ({route, navigation}) => {

  // const {navigation} = props;

  useEffect(() => {
    let isMounted = true
    if(isMounted){
      navigation.setOptions({title: "Event Detail"})
    }
    return () => {isMounted = false}
  },[])

  return (
    <View style={styles.container}>
      <Text>DetailEvent</Text>
    </View>
  )
}

export default DetailEvent

const styles = StyleSheet.create({
  container:{
    padding: 10
  }
})