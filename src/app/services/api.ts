import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// Interfaz para limpiar y tipar los datos de las canciones
export interface Cancion {
  trackId: number;
  trackName: string;     // Nombre de la canción
  artistName: string;    // Nombre del artista
  collectionName: string;// Álbum
  artworkUrl100: string; // Portada del disco (Imagen)
  previewUrl: string;    // Link para escuchar un pedacito de la canción (Audio)
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL base de la API pública de iTunes
  private baseUrl = 'https://itunes.apple.com/search';

  constructor(private http: HttpClient) {}

  /**
   * Busca canciones en la API pública basadas en el nombre de un artista o género
   */
  async buscarMusica(termino: string): Promise<Cancion[]> {
    try {
      // Formateamos la URL para buscar música (limitamos a 10 resultados para que cargue rápido)
      const url = `${this.baseUrl}?term=${encodeURIComponent(termino)}&media=music&limit=10`;
      
      const respuesta: any = await firstValueFrom(this.http.get(url));
      
      // La API nos devuelve un objeto con un array dentro llamado 'results'
      return respuesta.results || [];
    } catch (error) {
      console.error('Error al consumir la API de música:', error);
      throw error;
    }
  }
}