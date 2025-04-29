// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Importa otros servicios que necesites (auth, storage, etc.)

const firebaseConfig = {
  apiKey: "AIzaSyDZs0V6I50r5ae15qr5AKPcB9BJVr4o6u0",
  authDomain: "cursos-73a72.firebaseapp.com",
  projectId: "cursos-73a72",
  storageBucket: "cursos-73a72.appspot.com",  // Nota: cambié el dominio a .appspot.com
  messagingSenderId: "927403924701",
  appId: "1:927403924701:web:6675a36ff2440f9156cf34",
  measurementId: "G-CM3WQFEY26"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa los servicios que necesites
export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);