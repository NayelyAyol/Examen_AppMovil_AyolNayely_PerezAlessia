import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    // Inicialización limpia y directa, idéntica a tu segundo código pero usando environments
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async guardarUbicacion(latitud: number, longitud: number, mapaUrl: string) {
    try {
      const { data, error } = await this.supabase
        .from('ubicaciones') 
        .insert([
          {
            latitud: latitud,
            longitud: longitud,
            mapa_url: mapaUrl
          }
        ]); // Quitamos el .select() si no necesitas recuperar la fila inmediatamente, haciéndolo aún más rápido

      if (error) throw error;
      console.log('Ubicación guardada en Supabase con éxito');
    } catch (error) {
      console.error('Error crítico al guardar en Supabase:', error);
    }
  }
}