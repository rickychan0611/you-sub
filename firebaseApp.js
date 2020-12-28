import firebase from "firebase/app";
// Required for side-effects
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");
require("firebase/functions");

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyBJDDsn8w9aBePxUqhA8Y7jlkuj3_6cA6o",
        authDomain: "you-sub-app.firebaseapp.com",
        databaseURL: "https://you-sub-app-default-rtdb.firebaseio.com",
        projectId: "you-sub-app",
        storageBucket: "you-sub-app.appspot.com",
        messagingSenderId: "7850968718",
        appId: "1:7850968718:web:dc9bfe8ac345816af56bdf",
        measurementId: "G-4PXFVNWMHS"
    });
};

export const db = firebase.firestore();
export const auth = firebase.auth()
export const storage = firebase.storage()
export const functions = firebase.functions()

functions.useFunctionsEmulator('http://localhost:5001')

