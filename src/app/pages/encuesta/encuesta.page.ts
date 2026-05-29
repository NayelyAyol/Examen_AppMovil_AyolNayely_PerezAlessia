import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons'; 
import { searchOutline, locationOutline, camera } from 'ionicons/icons'; 
import { EncuestaService, Encuesta } from '../../services/encuesta.service';
import { LocationService } from '../../services/location';
import { PhotoService } from '../../services/photo.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonIcon
  ]
})
export class EncuestaPage implements OnInit {

  private encuestaService = inject(EncuestaService);
  private loc = inject(LocationService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastController = inject(ToastController);

  encuesta: any = {
    nombre_alias: '',
    edad_rango: '',
    rol: '',
    videojuego_favorito: '',
    plataforma: '',
    genero: '',
    comentario: '',
    lugar_campus: '',
    latitud: null,
    longitud: null,
    fecha_hora: null,
    foto_url: 'assets/icon/image.png'
  };

  roles = ['Estudiante', 'Docente', 'Administrativo', 'Visitante'];
  edades = ['Menos de 15 años', '15 a 18 años', '19 a 25 años', '26 a 35 años', 'Más de 35 años'];
  lugaresCampus = ['Biblioteca', 'Cafetería', 'Patio Central', 'Laboratorio', 'Entrada Principal'];

  juegosSugeridos: any[] = [];
  juegoSeleccionadoApi: any = null;

// ... resto de tus inyecciones privadas
  private supabaseService = inject(SupabaseService); 

  constructor(private photoService: PhotoService) {
    addIcons({ searchOutline, locationOutline, camera });
  }

  async tomarFotoEncuestado() {
    await this.photoService.addNewToGallery();
    
    if (this.photoService.photos.length > 0) {
      const photo = this.photoService.photos[0];
      
      // Convertir el path a Blob para subirlo a Supabase
      const response = await fetch(photo.webviewPath!);
      const blob = await response.blob();
      
      // Llamar al método del servicio Supabase que definimos
      const url = await this.supabaseService.subirFoto(blob, `encuesta_${Date.now()}.png`);
      
      if (url) {
        this.encuesta.foto_url = url; 
        this.mostrarToast('Foto subida a la nube exitosamente', 'success');
      } else {
        this.mostrarToast('Error al subir la foto a la nube', 'error');
      }
    }
  }

  async ngOnInit() {
    try {
      await this.loc.ensurePermissions();
      await this.cargarCoordenadasGps();
    } catch (e) {
      console.error('Error al solicitar permisos de localización:', e);
      await this.mostrarToast('Por favor, activa el GPS para registrar la encuesta', 'error');
    }
  }

  async cargarCoordenadasGps() {
    try {
      const pos = await this.loc.getCurrentPosition();
      this.encuesta.latitud = pos.coords.latitude;
      this.encuesta.longitud = pos.coords.longitude;
    } catch (error) {
      console.error('No se pudo obtener coordenadas en vivo:', error);
    }
  }

  async mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'error') {
    try {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 2200,
        position: 'top',
        cssClass: tipo === 'success' ? 'toast-success' : 'toast-error',
      });
      await toast.present();
    } catch (e) {
      console.error(e);
    }
  }

  async buscarVideojuegoApi(event: any) {
    const valorBusqueda = event.target.value;

    if (!valorBusqueda || valorBusqueda.trim().length < 2) {
      this.juegosSugeridos = [];
      return;
    }

    try {
      const url = 'https://www.freetogame.com/api/games';
      const juegos: any = await firstValueFrom(this.http.get(url));
      
      this.juegosSugeridos = juegos.filter((juego: any) =>
        juego.title.toLowerCase().includes(valorBusqueda.toLowerCase())
      ).slice(0, 5);
    } catch (error) {
      console.error('Error buscando juegos en la API:', error);
    }
  }

  seleccionarJuego(juego: any) {
    this.encuesta.videojuego_favorito = juego.title;
    
    this.juegoSeleccionadoApi = {
      juego_imagen_url: juego.thumbnail,
      juego_descripcion: juego.short_description,
      juego_rating: '4.5',
      juego_genero_api: juego.genre || 'Otro',
      juego_plataforma_api: juego.platform || 'PC (Windows)'
    };

    this.encuesta.genero = this.juegoSeleccionadoApi.juego_genero_api;
    this.encuesta.plataforma = this.juegoSeleccionadoApi.juego_plataforma_api;
    
    this.juegosSugeridos = [];
    this.mostrarToast(`Datos de ${juego.title} cargados exitosamente`, 'success');
  }

  async guardarEncuesta() {
    await this.cargarCoordenadasGps();

    if (!this.encuesta.nombre_alias.trim() || !this.encuesta.videojuego_favorito.trim() || !this.encuesta.edad_rango || !this.encuesta.rol || !this.encuesta.lugar_campus) {
      await this.mostrarToast('Por favor, completa todos los campos obligatorios', 'error');
      return;
    }

    try {
      this.encuesta.fecha_hora = new Date().toISOString();

      if (!this.juegoSeleccionadoApi) {
        this.juegoSeleccionadoApi = {
          juego_imagen_url: 'assets/icon/image.png',
          juego_descripcion: 'Ingreso manual. No se recuperaron metadatos.',
          juego_rating: '0.0',
          juego_genero_api: this.encuesta.genero || 'Otro',
          juego_plataforma_api: this.encuesta.plataforma || 'No especificado'
        };
      }

      const objetoDeEnvio: any = {
        ...this.encuesta,
        ...this.juegoSeleccionadoApi
      };

      await this.encuestaService.crearEncuesta(objetoDeEnvio);
      await this.mostrarToast('Encuesta y Ubicación GPS guardadas con éxito', 'success');

      this.encuesta = {
        nombre_alias: '',
        edad_rango: '',
        rol: '',
        videojuego_favorito: '',
        plataforma: '',
        genero: '',
        comentario: '',
        lugar_campus: '',
        latitud: null,
        longitud: null,
        fecha_hora: null,
        foto_url: 'assets/icon/image.png'
      };
      this.juegoSeleccionadoApi = null;

      this.router.navigate(['/registros']);

    } catch (error) {
      console.error(error);
      await this.mostrarToast('Error de red al guardar en la base de datos', 'error');
    }
  }

  // 1. Obtiene la posición solo cuando el usuario aplasta el botón
  async obtenerUbicacionActual() {
    try {
      const pos = await this.loc.getCurrentPosition();
      this.encuesta.latitud = pos.coords.latitude;
      this.encuesta.longitud = pos.coords.longitude;
      await this.mostrarToast('Ubicación capturada con éxito', 'success');
    } catch (error) {
      console.error(error);
      await this.mostrarToast('No se pudo obtener el GPS', 'error');
    }
  }

  // 2. Abre Google Maps en una pestaña nueva
  abrirGoogleMaps() {
    if (this.encuesta.latitud && this.encuesta.longitud) {
      const url = `https://www.google.com/maps/search/?api=1&query=${this.encuesta.latitud},${this.encuesta.longitud}`;
      window.open(url, '_blank');
    }
  }
}