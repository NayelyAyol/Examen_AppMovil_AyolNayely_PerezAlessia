import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment'; // <-- Importamos los environments

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  // Inicializamos Firebase usando el objeto centralizado en el environment
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  constructor() {}

  async guardarUbicacion(latitud: number, longitud: number, mapaUrl: string) {
    try {
      const docRef = await addDoc(
        collection(this.db, 'Ubicacion'),
        {
          latitud,
          longitud,
          mapaUrl,
          fecha: new Date()
        }
      );
      console.log('Documento guardado en Firebase:', docRef.id);
    } catch (error) {
      console.error('Error Firebase:', error);
    }
  }
}