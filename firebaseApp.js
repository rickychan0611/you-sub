import firebase from "firebase/app";
// Required for side-effects
require("firebase/auth");
require("firebase/database");
require("firebase/storage");
require("firebase/functions");

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyDvirfkNmpRDgNjFESYojMTagLW2yWE88c",
        authDomain: "you-sub-auto.firebaseapp.com",
        databaseURL: "https://you-sub-auto-default-rtdb.firebaseio.com",
        projectId: "you-sub-auto",
        storageBucket: "you-sub-auto.appspot.com",
        messagingSenderId: "935404963899",
        appId: "1:935404963899:web:d1013c4929f48ace2fb41e"
    });
};

export const db = firebase.database();
export const auth = firebase.auth()
export const storage = firebase.storage()
export const functions = firebase.functions()

functions.useFunctionsEmulator('http://localhost:5001')

