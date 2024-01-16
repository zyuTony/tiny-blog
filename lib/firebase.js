import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1EXrmSkcIXvfrBqkimhFXKpEm13_3fHw",
  authDomain: "my-tiny-blog.firebaseapp.com",
  projectId: "my-tiny-blog",
  storageBucket: "my-tiny-blog.appspot.com",
  messagingSenderId: "177463810851",
  appId: "1:177463810851:web:a4eb02d8e12e0e29b04a96",
  measurementId: "G-68KPJXR42Q",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
