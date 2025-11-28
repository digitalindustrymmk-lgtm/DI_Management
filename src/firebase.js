import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyAc2g-t9A7du3K_nI2fJnw_OGxhmLfpP6s",
    authDomain: "dilistname.firebaseapp.com",
    databaseURL: "https://dilistname-default-rtdb.firebaseio.com",
    projectId: "dilistname",
    storageBucket: "dilistname.firebasestorage.app",
    messagingSenderId: "897983357871",
    appId: "1:897983357871:web:42a046bc9fb3e0543dc55a",
    measurementId: "G-NQ798D9J6K"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export const db = firebase.database();
export const auth = firebase.auth();
export default firebase;