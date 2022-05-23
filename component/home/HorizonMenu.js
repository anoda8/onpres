import React from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

const HorizonMenu = (props) => {
    return (
        <View style={styles.container}>
            <IconButton icon="cog" style={styles.iconButton} color="#FFFFFF" onPress={props.onPress} />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        marginVertical: 10,
        backgroundColor: '#640101',
        width: '100%',
        height: 40,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'flex-end'
    },
    iconButton:{
        margin: 2,
    }
});

export {HorizonMenu}
