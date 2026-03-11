import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDL3Lu07yGva9f_pICmLQY7dCwWWixCIDA",
    authDomain: "urkio.com",
    projectId: "urkio-65fb0",
    storageBucket: "urkio-65fb0.firebasestorage.app",
    messagingSenderId: "381336389343",
    appId: "1:381336389343:web:02999fb3b31b78071a0b6a",
    measurementId: "G-J7LG1H2XKE",
    databaseURL: "https://urkio-65fb0-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({})
});
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
