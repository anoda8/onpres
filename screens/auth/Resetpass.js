import { useRoute } from '@react-navigation/core'
import React, {useState, useEffect} from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Image, Text, ImageBackground} from 'react-native'
import { TextInput, Button, ActivityIndicator } from 'react-native-paper'
import { Axio } from '../../services/ApiService';
import { Warning } from '../../tools/Message';

const Resetpass = ({route, navigation}) => {

    const router = useRoute();

    useEffect(() => {
        if(router.params){
            setEmail(router.params?.user.email)
        }
    })

    const [email, setEmail] = useState(null);
    const [pass, setPassword] = useState(null);
    const [repass, setRepass] = useState(null);

    const doReset = () => {

        if((pass == null) || (repass == null)){
            return Warning("Password kosong", "Lengkapi kolom password dan konfirmasi password");
        }

        if(pass != repass){
            return Warning("Password salah", "Konfirmasi password tidak sama dengan password");
        }

        Axio.post('doreset', {email: email, password: pass, password_confirmation: repass}).then(response => {
            console.log(response.data)
            if(response.status == 201){
                //kasih pesan sukses
                navigation.replace("Login", {...response.data})
            }
        }).catch(error => {
            console.log(error.response)
        });

    }

    return (
        <View style={styles.topContainer}>
            <ImageBackground source={require('../../assets/images/background1.png')} style={styles.imageBackground}>
                <ScrollView style={styles.container}>
                    <KeyboardAvoidingView behavior='position'>
                        <View style={styles.header}>
                            <Image style={styles.logo} source={require('../../assets/images/onpres_logo.png')} />
                            <Text style={styles.title}>Reset Password</Text>                        
                        </View>
                        <TextInput mode='flat' label='Email' value={email} onChangeText={text => setEmail(text)} style={styles.inputForm} />
                        <TextInput mode='flat' label='Password' value={pass} onChangeText={text => setPassword(text)} style={styles.inputForm} secureTextEntry={true} />
                        <TextInput mode='flat' label='Password Confirmation' value={repass} onChangeText={text => setRepass(text)} style={styles.inputForm} secureTextEntry={true} />
                        <Button mode='contained' style={styles.buttonFrom} onPress={() => doReset()}>Reset</Button>
                        <Button mode='text' style={styles.button} onPress={() => navigation.replace("Login")}>Login ?</Button>
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

export default Resetpass

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