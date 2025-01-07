import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBmoR8IcIBwjyrn45OogkDC4d_uAItA_W8",
    authDomain: "visionai-b1c3a.firebaseapp.com",
    projectId: "visionai-b1c3a",
    storageBucket: "visionai-b1c3a.firebasestorage.app",
    messagingSenderId: "858950144806",
    appId: "1:858950144806:web:d72a8f84000b83591427e7",
    measurementId: "G-B9WC88DX9P"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
