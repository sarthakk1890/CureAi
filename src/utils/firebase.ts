import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDqHRAthzasJ4ktTbE9bFuS2FOUTnh9x0s",
    authDomain: "cureai-8b527.firebaseapp.com",
    projectId: "cureai-8b527",
    storageBucket: "cureai-8b527.firebasestorage.app",
    messagingSenderId: "711215248612",
    appId: "1:711215248612:web:38e3776cce7471ac1968f1",
    measurementId: "G-YQT9NHJZ4X"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);