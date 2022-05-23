import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

async function getJwtToken() {
    let jwt = null;
    try{
        jwt = await SecureStore.getItemAsync('jwtToken');
    }catch(error){
        console.log(error)
    }
    return jwt;
}

// async function logout() {
//     let doLogout = false;
//     try{
//         let logout = await SecureStore.deleteItemAsync('jwtToken');
//         if(logout) {doLogout = true;}
//     }catch(error){
//         console.log(error)
//     }
//     return doLogout;
// }

async function getUserData() {
    let userdata = [];
    try{
        let data = await AsyncStorage.getItem("@user");
        userdata = JSON.parse(data);
    }catch(error){
        console.log(error)
    }
    return userdata;
}

module.exports = {
    getUserData: getUserData(),
    getJwtToken: getJwtToken(),
}