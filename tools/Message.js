import { Alert } from "react-native"

export function Warning(title, message){
    Alert.alert(
        title,
        message,
        [{
            text: "Oke"
        }]
    )
}

// export function Confirm(){
//     Alert.prompt()
// }