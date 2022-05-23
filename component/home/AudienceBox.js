import React, {useState, useEffect, useLayoutEffect} from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Button } from 'react-native-paper'
import { Audiences } from '../lists/Audiences'
import { CallApi } from '../../services/ApiService'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { getUserData, getJwtToken } from '../../services/Userdata'

const AudienceBox = (props) => {

    const navigation = useNavigation();
    const [audiencesData, setAudiencesData] = useState([])
    const [blockdata, setBlockdata] = useState([])

    return (
        <View style={styles.container}>
            <View style={styles.boxTitle}>
                <Text style={styles.title}>I'm Audience</Text>
            </View>
            <View>
                <Audiences audiencedata={props?.objdata} blockdata={props?.blockdata} />
            </View>  
            <View style={styles.moreNavigation}>
                <Button uppercase={false} mode='text' onPress={() => navigation.navigate("ListAudiences", {blockdata: props?.blockdata})}>More Audiences...</Button>
            </View>          
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: "100%",
        height: "65%",
        backgroundColor: "#ffffff",
        elevation: 5,
        borderRadius: 10,
        marginTop: 5
    },
    boxTitle:{
        // flex: 0.2,
        height: 50,
        backgroundColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        paddingTop: 10,
    },
    title:{
        fontWeight: 'bold',
        color: "#ffffff"
    },
    moreNavigation:{
        flex: 1,
        justifyContent: 'flex-end',
    }
})

export {AudienceBox}