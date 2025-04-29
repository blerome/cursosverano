import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuración de Firebase (usa la misma que en tu firebaseConfig.ts)
const firebaseConfig = {
  apiKey: "AIzaSyDZs0V6I50r5ae15qr5AKPcB9BJVr4o6u0",
  authDomain: "cursos-73a72.firebaseapp.com",
  projectId: "cursos-73a72",
  storageBucket: "cursos-73a72.appspot.com",
  messagingSenderId: "927403924701",
  appId: "1:927403924701:web:6675a36ff2440f9156cf34",
  measurementId: "G-CM3WQFEY26"
};

// Datos iniciales
const initialData = {
  carreras: [
    {
      nombre: "Ingeniería en Sistemas C.",
      materias: [
        {
          nombre: "Programación Avanzada",
          creditos: 4,
          imagen: "https://images.unsplash.com/photo-1551033406-611cf9a28f67",
          clave: "PROG-401"
        },
        {
            nombre: "Calculo Diferencial",
            creditos: 4,
            imagen: "https://images.unsplash.com/photo-1551033406-611cf9a28f67",
            clave: "PROG-401"
          },
        // ... más materias
      ]
    }
    // ... más carreras
  ]
};

async function main() {
  console.log("Inicializando Firebase...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("Poblando datos iniciales...");
  
  for (const carrera of initialData.carreras) {
    console.log(`> Agregando carrera: ${carrera.nombre}`);
    
    const carreraRef = await addDoc(collection(db, 'carreras'), {
      nombre: carrera.nombre
    });

    for (const materia of carrera.materias) {
      await addDoc(collection(db, `carreras/${carreraRef.id}/materias`), materia);
      console.log(`  - Materia: ${materia.nombre}`);
    }
  }

  console.log("¡Datos iniciales creados con éxito!");
  process.exit(0);
}

main().catch(console.error);