// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwNGQgAubqu_OFOeRpkXaomJXbmu13yBg",
  authDomain: "onpres-53363.firebaseapp.com",
  projectId: "onpres-53363",
  storageBucket: "onpres-53363.appspot.com",
  messagingSenderId: "184832712223",
  appId: "1:184832712223:web:702b1b12443eab4fa87f2a"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}else{
    app = firebase.app()
}

const auth = firebase.auth();

export {auth};