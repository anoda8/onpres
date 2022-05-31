import { ToastAndroid } from "react-native";

export const ToastPresenceLong = (message) => {
    ToastAndroid.showWithGravityAndOffset(message,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
}

export const ToastPresenceShort = (message) => {
    ToastAndroid.showWithGravityAndOffset(message,ToastAndroid.SHORT,ToastAndroid.BOTTOM,25,50);
}