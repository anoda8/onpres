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
                <List.Icon color='#640101' icon="account-circle" style={styles.listIcon} />
                <Text style={styles.textItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItem} onPress={() => konfirmasiLogout()}>
                <List.Icon color='#640101' icon="translate" style={styles.listIcon} />
                <Text style={styles.textItem}>Language</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItem} onPress={() => konfirmasiLogout()}>
                <List.Icon color='#640101' icon="badge-account-horizontal" style={styles.listIcon} />
                <Text style={styles.textItem}>User Guide</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItem} onPress={() => konfirmasiLogout()}>
                <List.Icon color='#640101' icon="help-circle" style={styles.listIcon} />
                <Text style={styles.textItem}>About Developer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.listItem, ...styles.logoutButton }} onPress={() => konfirmasiLogout()}>
                <List.Icon color='#FFFFFF' icon="logout" style={styles.listIcon} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    listItem:{
        height: 60,
        backgroundColor: '#dddddd',
        padding: 10,
        flexDirection: 'row',
        borderBottomColor: '#000000',
        borderBottomWidth: 1
    },
    listIcon:{
        padding: 0,
        margin: 0
    },
    textItem:{
        margin: 8
    },
    logoutButton:{
        backgroundColor: '#640101',
        fontWeight: 'bold',
    },
    logoutText:{
        color: '#FFFFFF',
        margin: 7,
        fontSize: 17
    }
})
