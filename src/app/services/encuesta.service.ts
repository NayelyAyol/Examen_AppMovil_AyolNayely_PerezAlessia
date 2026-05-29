import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Encuesta {
  id?: string;
  usuario_id?: string;
  nombre_alias: string;
  edad_rango: string;
  rol: string;
  videojuego_favorito: string;
  plataforma: string;
  genero: string;
  comentario?: string;

  latitud?: number;
  longitud?: number;
  lugar_campus?: string;
  fecha_hora?: string;

  foto_url?: string;

  juego_imagen_url?: string;
  juego_genero_api?: string;
  juego_plataforma_api?: string;
  juego_descripcion?: string;
  juego_rating?: string;

  created_at?: string;
  api_data?: any; // Mantenido por compatibilidad de tipos
}

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor(private supabaseService: SupabaseService) { }

  async crearEncuesta(encuesta: Encuesta) {
    const { data: userData, error: userError } =
      await this.supabaseService.supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('No hay usuario autenticado');
    }

    // Clonamos el objeto y limpiamos api_data si se coló del controlador
    let datosParaSupabase: any = { ...encuesta };
    if (datosParaSupabase.api_data) {
      delete datosParaSupabase.api_data;
    }

    const nuevaEncuesta = {
      ...datosParaSupabase,
      usuario_id: userData.user.id
    };

    const { data, error } = await this.supabaseService.supabase
      .from('encuestas')
      .insert([nuevaEncuesta])
      .select()
      .single();

    if (error) {
      console.error('Error al guardar encuesta:', error);
      throw error;
    }

    return data;
  }

  async obtenerEncuestas() {
    return this.listarEncuestas();
  }

  async listarEncuestas() {
    const { data, error } = await this.supabaseService.supabase
      .from('encuestas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al listar encuestas:', error);
      throw error;
    }

    return data as Encuesta[];
  }

  async obtenerEncuestaPorId(id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('encuestas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener encuesta:', error);
      throw error;
    }

    return data as Encuesta;
  }

  async eliminarEncuesta(id: string) {
    const { error } = await this.supabaseService.supabase
      .from('encuestas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar encuesta:', error);
      throw error;
    }

    return true;
  }
}