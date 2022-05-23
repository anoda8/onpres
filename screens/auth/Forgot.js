import React, {useState} from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Image, Text, ImageBackground} from 'react-native'
import { TextInput, Button, ActivityIndicator } from 'react-native-paper'
import { Axio } from '../../services/ApiService';
import { Warning } from '../../tools/Message'

const Forgot = ({route, navigation}) => {

    const [email, setEmail] = useState(null);
    const [kodeAktivasi, setKodeAktivasi] = useState(null);
    const [sudahKirim, setSudahKirim] = useState(true);

    const kirimKodeAkv = () => {

        if(email == null){
            return Warning("Email Kosong", "Isikan email terlebih dahulu, lalu kirim kode Aktivasi");
        }

        Axio.post('lupa', {email: email}).then(response => {
            console.log(response);
            if(response.status == 201){
                Warning("Kode aktivasi terkirim, silahkan cek email anda.")
                setSudahKirim(false);
            }
        }).catch(error => {
            console.log(error.response);
            if(error.response.status == 401){
                Warning("Email salah", "Email anda tidak ditemukan");
            }
        })

    }

    const activate = () => {
        
        if(kodeAktivasi == null){
            return Warning("Kode Aktivasi Kosong", "Periksa email anda dan masukkan kode aktivasi");
        }

        Axio.post('aktiflupa', {email: email, kode_aktivasi: kodeAktivasi}).then(response => {
            console.log(response.data)
            navigation.replace("ResetPassScreen", {...response.data})
        }).catch(error => {
            console.log(error.response.data)
            return Warning("Kode Salah", "Kode aktivasi yang anda masukkan tidak ada.")
        })
    }

    return (
        <View style={styles.topContainer}>
            <ImageBackground source={require('../../assets/images/background1.png')} style={styles.imageBackground}>
                <ScrollView style={styles.container}>
                    <KeyboardAvoidingView behavior='position'>
                        <View style={styles.header}>
                            <Image style={styles.logo} source={require('../../assets/images/onpres_logo.png')} />
                            <Text style={styles.title}>Lupa Password</Text>
                            <Text style={styles.alert}>Isikan email dan kirim kode aktivasi, kemudian periksa email anda dan masukkan kode aktivasinya.</Text>
                        </View>
                        <TextInput mode='flat' label='Email' value={email} onChangeText={text => setEmail(text)} style={styles.inputForm}/>
                        <TextInput mode='flat' label='Kode Aktivasi' disabled={sudahKirim} value={kodeAktivasi} onChangeText={text => setKodeAktivasi(text)} style={styles.inputForm}/>
                        <Button mode='contained' style={styles.buttonFrom} onPress={() => activate()}>Reset Password</Button>
                        <Button mode='text' style={styles.buttonFrom} onPress={() => kirimKodeAkv()}>Kirim Kode Aktivasi >></Button>
                        <Button mode='text' style={styles.buttonFrom} onPress={() => navigation.replace("Login")}>Login ?</Button>
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

export default Forgot

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
