import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Avatar } from 'react-native-paper'

const Header = (props) => {    
    return (        
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <Text style={styles.userNama}>{props.userdata.name}</Text>
                <Text>{props.userdata.email}</Text>
            </View>
            <View style={styles.userAvatar}>
                <Avatar.Image size={60} source={{uri:"../../../assets/images/onpres_logo.png"}} />
            </View>
        </View>        
    );
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        backgroundColor: '#D8B6A4',
        justifyContent:"space-between",
        padding: 10,
        borderRadius: 10,
        elevation: 5
    },
    userInfo:{
        flexGrow: 1,
        backgroundColor: '#D8B6A4',
        padding: 10
    },
    userAvatar:{
        marginLeft: 10
    },
    userNama:{
        fontWeight: 'bold',
        fontSize: 18
    }
})

export {Header};