import React, {useState, useEffect} from 'react'
import { StyleSheet, View, ScrollView, Text, ImageBackground, KeyboardAvoidingView, Image} from 'react-native'
import { Button, TextInput, ActivityIndicator } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createUserWithEmailAndPassword  } from 'firebase/auth'
import { auth } from '../../firebase'
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Warning } from '../../tools/Message';
import * as Updates from 'expo-updates';

//percobaan
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Axio } from '../../services/ApiService'

WebBrowser.maybeCompleteAuthSession();

const Login = ({route, navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //percobaan
    const [accessToken, setAccessToken] = useState();
    const [loading, setLoading] = useState(false);
    // const [userInfo, setUserInfo] = useState(null);

    const [request, responseGoogleAuth, promptAsync] = Google.useAuthRequest({
        androidClientId: "101974201567-dalh055af5rs8aupeflep9c6q4233fa0.apps.googleusercontent.com",
        expoClientId: "101974201567-i5evdi6fbqsaccpuu7tfrl4rdhug35si.apps.googleusercontent.com"
    });

    useEffect(() => {
        let isMounted = true;
        if(isMounted){
            setEmail(route.params?.userEmailActivation);
        }
        return () => {isMounted = false;}
    }, [route.params?.userEmailActivation])

    useEffect(async () => {

        let isMounted = true;
        
        if(isMounted){

            if(responseGoogleAuth?.type === "success"){
                setLoading(true);
                let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
                    headers: { Authorization: `Bearer ${responseGoogleAuth.authentication.accessToken}`}
                });

                userInfoResponse.json().then(userInfo => {
                    // console.log(data)
                    Axio.get(`/cekuser/${userInfo?.email}`).then(res => {
                        if(res.data?.exists){
                            doExtraLogin(userInfo?.email);
                        }else{
                            if(typeof userInfo != 'undefined'){
                                navigation.push("Register", {oauth: {status: true, userdt: userInfo}});
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                });                
            }
        }   

        return () => {isMounted = false;}
    }, [responseGoogleAuth])

    const doLogin = () => {
        if(!validateEmail(email)){
            alert("Wrong email format, please enter valid email address");
            return;
        }

        if(email == null){return Warning("Email kosong", "Isi kolom email")}
        if(password == null){return Warning("Password kosong", "Isi kolom password")}

        Axio.post('login', {email: email, password: password}).then(async (response) => {
            let statsimpan = false;
            try{
                await SecureStore.setItemAsync('jwtToken', response.data.jwt);
                await AsyncStorage.setItem('@user', JSON.stringify(response.data.user));
                statsimpan = true;
            }catch(error){
                console.log(error);
            }

            if(statsimpan){
                Updates.reloadAsync();
            }else{
                return Warning("Failed", "Error occurred");
            }
        }).catch(error => {
            console.log(error.response)
            if(error.response.status == 401){
                return Warning("Kesalahan", error.response.data.message);
            }
        })
    }

    const doExtraLogin = (email) => {
        Axio.post('logingoogle', {email:email}).then(async (response) => {
            let statsimpan = false;
            if(response.status == 201){
                try{
                    await SecureStore.setItemAsync('jwtToken', response.data.jwt);
                    await AsyncStorage.setItem('@user', JSON.stringify(response.data.user));
                    statsimpan = true;
                }catch(error){
                    console.log(error);
                }
            }

            if(statsimpan){
                Updates.reloadAsync();
            }else{
                return Warning("Failed", "Error occurred");
            }
        }).catch(error => {
            console.log(error.response);
        })
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // function showUserInfo(){
    //     if(userInfo){
    //         return (
    //             <View>
    //                 <Text>{userInfo.name}</Text>
    //             </View>
    //         )
    //     }
    // }

    // const handleSignUp = () => { 
    //     createUserWithEmailAndPassword(auth, email, password).then(userCredentials => {
    //         const user = userCredentials.user;
    //         console.log(user)
    //     }).catch(error => {
    //         alert(error);
    //     })
    // }

    return (
        <ImageBackground source={require('../../assets/images/background1.png')} style={styles.imageBackground}>
            <KeyboardAvoidingView behavior='height' style={{ flex: 1, flexDirection: 'column', justifyContent:'center' }}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <Image style={styles.logo} source={require('../../assets/images/onpres_logo.png')} />
                        <Text style={styles.title}>Login</Text>                        
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={text => setEmail(text)}  />
                        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={text => setPassword(text)} secureTextEntry />
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.mainButtonContainer}>
                            <Button style={styles.button} mode='contained' onPress={() => navigation.push("Register")}>Register</Button>
                            <Button style={styles.button} mode='contained' onPress={doLogin}>Login</Button>
                        </View>
                        <Button style={{ ...styles.button, marginBottom: 10}} mode='contained' onPress={() => {promptAsync({showInRevents: true})}}>Login With Google</Button>
                        <Button mode='text' style={styles.button} onPress={() => navigation.replace("Resetpass")}>Forgot Password ?</Button>
                    </View>
                    <View style={styles.appInfo}>
                        <Text>Version 2.0</Text>
                        <Text>https://anoda.web.id</Text>
                    </View>
                    <ActivityIndicator size='large' color='#000000' animating={loading} />
                </SafeAreaView>
            </KeyboardAvoidingView>            
        </ImageBackground>
    )
}

export default Login

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 25,
    },
    imageBackground:{
        flex: 1
    },
    mainButtonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 300
    },
    header:{
        alignItems: 'center',
        marginBottom: 40
    },
    title:{
        fontWeight: 'bold',
        marginTop: 20,
        fontSize: 18
    },
    logo:{
        width: 300,
        height: 75,
        resizeMode: 'stretch',
    },
    inputContainer:{

    },
    buttonContainer:{
        alignItems: 'center'
    },
    input:{
        marginBottom: 20
    },
    button:{
        marginBottom: 25,
        borderRadius: 10
    },
    appInfo:{
        alignItems: 'center'
    }
})