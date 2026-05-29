import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
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

  async subirFoto(blob: Blob, nombreArchivo: string): Promise<string | null> {
    try {
      const { error } = await this.supabase.storage
        .from('fotos-encuestas')
        .upload(nombreArchivo, blob);

      if (error) throw error;

      const { data } = this.supabase.storage
        .from('fotos-encuestas')
        .getPublicUrl(nombreArchivo);

      return data.publicUrl;
    } catch (error) {
      console.error('Error al subir la foto a Supabase:', error);
      return null;
    }
  }
}