import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXSCC7xJdWLCEG30nCqtOMexPqnsvP74o",
  authDomain: "lairos-pathfinder.firebaseapp.com",
  projectId: "lairos-pathfinder",
  storageBucket: "lairos-pathfinder.firebasestorage.app",
  messagingSenderId: "524562688201",
  appId: "1:524562688201:web:92634518da1e197e4a8518",
  measurementId: "G-KD045CS66C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  doc,
  getDoc,
  onAuthStateChanged,
  setDoc,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
};
