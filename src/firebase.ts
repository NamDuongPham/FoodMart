// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7pbV5Z5acP8GWilrjOelCxGVYbPWlpXI",
  authDomain: "admin-food-f8e42.firebaseapp.com",
  databaseURL: "https://admin-food-f8e42-default-rtdb.firebaseio.com",
  projectId: "admin-food-f8e42",
  storageBucket: "admin-food-f8e42.appspot.com",
  messagingSenderId: "240527090798",
  appId: "1:240527090798:web:d0bf080cb1c95880caf27f",
  measurementId: "G-8DXZ2SVQVD"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const auth = getAuth(app);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const db = getDatabase(app)
export const provider = new GoogleAuthProvider();

