import React, {useState, useEffect} from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Image, Text, ImageBackground} from 'react-native'
import { TextInput, Button, ActivityIndicator } from 'react-native-paper'
import { Axio } from '../../services/ApiService';
import { Warning } from '../../tools/Message';

const Register = ({route, navigation}) => {

    const [email, setEmail] = useState(null);
    const [nama, setNama] = useState(null);
    const [pass, setPass] = useState(null);
    const [repass, setRepass] = useState(null);
    const [disabledEmail, setDisabledEmail] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if(isMounted){
            if(route.params?.oauth.status){
                let dataOauth = route.params?.oauth.userdt;
                setDisabledEmail(true);
                setEmail(dataOauth.email);
                // console.log(route.params?.oauth);
                setNama(dataOauth.given_name+" "+dataOauth.family_name);
            }
        }
        return () => {isMounted = false;}
    },[route.params?.oauth]);

    const doRegister = () => {
        // console.log('sampe sini');
        if(!validateEmail(email)){return Warning("Email salah", "Format email anda salah")}
        if((email == null) || (email.trim() == "")){return Warning("Email kosong", "Isikan email aktif anda")}
        if((nama == null) || (nama.trim() == "")){return Warning("Nama kosong", "Isikan nama anda")}
        if((pass == null) || (pass.trim() == "")){return Warning("Password kosong", "Isikan password anda")}
        if((repass == null) || (repass.trim() == "")){return Warning("Konfirmasi Password kosong", "Isikan konfirmasi password anda")}
        if(pass !== repass){return Warning("Konfirmasi Password salah", "Password harus sama dengan konfirmasi password")}
        
        let data = {
            name: nama,
            email: email,
            password: pass,
            password_confirmation: repass
        }


        Axio.post('register', data).then(response => {
            setLoading(true)
            console.log(response);
            if(response.status === 201){
                navigation.navigate('Activation', {...response.data});
            }
        }).catch(error => {
            console.log(error)
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return (
        <View style={styles.topContainer}>
            <ImageBackground source={require('../../assets/images/background1.png')} style={styles.imageBackground}>
                <ScrollView style={styles.container}>
                    <KeyboardAvoidingView behavior='position'>
                        <View style={styles.header}>
                            <Image style={styles.logo} source={require('../../assets/images/onpres_logo.png')} />
                            <Text style={styles.title}>Register</Text>
                        </View>
                        <TextInput mode='flat' label='Email' disabled={disabledEmail} value={email} onChangeText={text => setEmail(text)} style={styles.inputForm} />
                        <TextInput mode='flat' label='Name' value={nama} onChangeText={text => setNama(text)} style={styles.inputForm} />
                        <TextInput mode='flat' label='Password' value={pass} onChangeText={text => setPass(text)} style={styles.inputForm} secureTextEntry={true} />
                        <TextInput mode='flat' label='Ulang Password' value={repass} onChangeText={text => setRepass(text)} style={styles.inputForm} secureTextEntry={true} />
                        <Button mode='contained' style={styles.buttonFrom} onPress={() => doRegister()}>Register</Button>
                        <Button mode='text' style={styles.buttonFrom} onPress={() => navigation.replace("Login")}>Login ?</Button>
                        <View style={styles.appInfo}>
                            <Text>Version 2.0</Text>
                            <Text>https://anoda.web.id</Text>
                        </View>
                        <ActivityIndicator size='large' color='#000000' animating={loading} />              
                    </KeyboardAvoidingView>
                </ScrollView>
            </ImageBackground>          
        </View>
    )
}
export default Register
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
    }
})

