import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBiKsf8a2v83UWET3Bwio2izJ2RLw0DsA8",
    authDomain: "sync-spotify-playlist.firebaseapp.com",
    databaseURL: "https://sync-spotify-playlist-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sync-spotify-playlist",
    storageBucket: "sync-spotify-playlist.appspot.com",
    messagingSenderId: "379475798557",
    appId: "1:379475798557:web:f5c49033a2da2c5713b4f4",
    measurementId: "G-S47CVLRF6G"
};

const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getFirestore(app);
export {app, database};