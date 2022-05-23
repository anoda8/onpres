import { useRoute } from '@react-navigation/core'
import React, {useEffect, useState} from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Image, Text, ImageBackground} from 'react-native'
import { TextInput, Button, ActivityIndicator } from 'react-native-paper'
import { Axio } from '../../services/ApiService';
import { Warning } from '../../tools/Message';

const Activation = ({route, navigation}) => {
    const user = useRoute();
    const [kodeAktivasi, setKodeAktivasi] = useState(null);
    const [loading, setLoading] = useState(false);

    const aktivasi = () => {
        let data = {
            name: user.params?.user.name,
            email: user.params?.user.email,
            password: user.params?.user.password,
            kode_aktivasi: kodeAktivasi
        }

        if((kodeAktivasi == null)){
            if(kodeAktivasi.trim() == ""){
                return Warning("Kode Aktivasi kosong", "Lihat email anda, Isikan kode aktivasi dahulu"); 
            }            
        }

        Axio.post('aktivasi', data).then(response => {
            setLoading(true);
            
            // console.log(response.data)
            if(response.status == 201){
                navigation.replace("Login", {userEmailActivation: response.data.user.email})
            }           

        }).catch(error => {
            if(error.response.status == 401){
                return Warning("Kode Aktivasi", "Kode aktivasi tidak ditemukan, coba login atau ulangi mendaftar");
            }
        });
    }

    return (
        <View style={styles.topContainer}>
            <ImageBackground source={require('../../assets/images/background1.png')} style={styles.imageBackground}>
                <ScrollView style={styles.container}>
                    <KeyboardAvoidingView behavior='position'>
                        <View style={styles.header}>
                            <Image style={styles.logo} source={require('../../assets/images/onpres_logo.png')} />
                            <Text style={styles.title}>Aktivasi Akun</Text>
                            <Text style={styles.alert}>Periksa Email anda dan masukkan kode aktivasi yang kami kirim</Text>
                        </View>
                        <TextInput mode='flat' label='Email' value={user.params?.user.email} style={styles.inputForm} disabled={true}/>
                        <TextInput mode='flat' label='Kode Aktivasi' value={kodeAktivasi} onChangeText={text => setKodeAktivasi(text)} style={styles.inputForm}/>
                        <Button mode='contained' style={styles.buttonFrom} onPress={() => aktivasi()}>Aktivasi</Button>
                        <Button mode='text' style={styles.buttonFrom}>Kirim ulang Kode Aktivasi >></Button>
                        <View style={styles.appInfo}>
                            <Text>Versi 2.0</Text>
                            <Text>https://anoda.web.id</Text>
                        </View>
                        <ActivityIndicator size='large' color='#000000' animating={loading} />                
                    </KeyboardAvoidingView>
                </ScrollView>
            </ImageBackground>          
        </View>
    )
}

export default Activation

const styles = StyleSheet.create({
    topContainer:{
        flex: 1
    },
    container:{
        paddingTop: 50,
        paddingHorizontal: 30
    },
    header:{
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40
    },
    title:{
        fontWeight: 'bold',
        marginTop: 20,
        fontSize: 18
    },
    imageBackground:{
        flex: 1
    },
    inputForm:{
        marginBottom: 20
    }, 
    buttonFrom:{
        marginBottom: 20
    },
    logo:{
        width: 300,
        height: 75,
        resizeMode: 'stretch',
    },
    appInfo:{
        alignItems: 'center'
    },
    alert:{
        marginTop: 20,
        backgroundColor: 'pink',
        padding: 10,
        borderRadius: 10
    }
})