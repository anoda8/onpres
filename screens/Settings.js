import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { List, Colors } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { NavigationActions, StackActions } from '@react-navigation/native';
import * as Updates from 'expo-updates';

export default function Settings({route, navigation}) {

    async function doLogout() {
        let retLogout = false;
        try{
            await SecureStore.deleteItemAsync('jwtToken');
            Updates.reloadAsync();
        }catch(error){
            console.log(error)
        }
        return retLogout;
    }

    function konfirmasiLogout(){
        Alert.alert(
            "Konfirmasi Logout",
            "Apakah anda yakin akan keluar dari Aplikasi ?",
            [
                {
                    text: "Ya",
                    onPress: () => doLogout()
                },
                {
                    text: "Batal",
                    style: 'cancel'
                }
            ]
        );
    }

    return (
        <ScrollView>
            <TouchableOpacity style={styles.listItem} onPress={() => konfirmasiLogout()}>
                <List.Icon color='#640101' icon="logout" style={styles.listIcon} />
                <Text style={styles.textItem}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    listItem:{
        height: 60,
        backgroundColor: '#dddddd',
        padding: 10,
        flexDirection: 'row'
    },
    listIcon:{
        padding: 0,
        margin: 0
    },
    textItem:{
        margin: 8
    }
})
