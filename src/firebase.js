import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCBnQXzwXSN8guu4tZHbnQvLK95S_Ntq8c",
    authDomain: "instagram-clone-64e8c.firebaseapp.com",
    projectId: "instagram-clone-64e8c",
    storageBucket: "instagram-clone-64e8c.appspot.com",
    messagingSenderId: "453228349360",
    appId: "1:453228349360:web:77df6c134f7efec08d3875"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db, auth, storage}

