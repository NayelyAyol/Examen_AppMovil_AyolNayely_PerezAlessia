import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { LocationService } from '../../services/location';
import { SupabaseService } from '../../services/supabase.service';
import { FirebaseService } from '../../services/firebase.service';
import { addIcons } from 'ionicons';
import { mapOutline, locateOutline, playOutline, stopOutline } from 'ionicons/icons';

addIcons({
  mapOutline,
  locateOutline,
  playOutline,
  stopOutline
});

@Component({
  selector: 'app-gps',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon
  ],
  templateUrl: './gps.page.html',
  styleUrls: ['./gps.page.scss']
})
export class GpsPage implements OnInit, OnDestroy {

  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  mapsUrl = signal<string | null>(null);
  watchId: string | null = null;
  errorMsg = signal<string | null>(null);

  constructor(
    private loc: LocationService,
    private firebaseService: FirebaseService,
    private supabaseService: SupabaseService
  ) { }

  async ngOnInit() {
    try {
      await this.loc.ensurePermissions();
      await this.obtenerUbicacionActual();
      await this.iniciarSeguimiento();
    } catch (e: any) {
      this.errorMsg.set('Permisos de ubicación denegados o sensores no disponibles.');
    }
  }

  async obtenerUbicacionActual() {
    try {
      const pos = await this.loc.getCurrentPosition();
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      this.latitude.set(lat);
      this.longitude.set(lng);
      
      // Obtenemos la URL corregida
      const urlUrl = this.generarLinkGoogleMaps(lat, lng);

      // Enviamos a la nube de forma segura
      await this.firebaseService.guardarUbicacion(lat, lng, urlUrl);
      await this.supabaseService.guardarUbicacion(lat, lng, urlUrl);

      this.errorMsg.set(null);
    } catch (e: any) {
      this.mapearErrorEspanol(e);
    }
  }

  generarLinkGoogleMaps(lat: number, lng: number): string {
    // ✅ Usamos la URL oficial y limpia para que no te dé problemas
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    this.mapsUrl.set(url);
    
    return url; // 👈 ¡ESTA ES LA LÍNEA MÁGICA QUE FALTA!
  }

  abrirGoogleMaps() {
    const url = this.mapsUrl();
    if (url) {
      window.open(url, '_blank');
    }
  }

  async iniciarSeguimiento() {
    try {
      this.watchId = await this.loc.watchPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          this.latitude.set(lat);
          this.longitude.set(lng);
          const urlUrl = this.generarLinkGoogleMaps(lat, lng);

          // Guardado constante en ruta
          await this.firebaseService.guardarUbicacion(lat, lng, urlUrl);
          await this.supabaseService.guardarUbicacion(lat, lng, urlUrl);
        },
        (err) => {
          this.mapearErrorEspanol(err);
        }
      );
    } catch (e: any) {
      this.errorMsg.set('No se pudo iniciar el rastreo en tiempo real.');
    }
  }

  /**
   * 🇲🇽 Traduce los feos errores automáticos en inglés a mensajes amigables
   */
  mapearErrorEspanol(error: any) {
    console.error('Error original interceptado:', error);
    const mensajeOriginal = error?.message?.toLowerCase() || '';

    if (mensajeOriginal.includes('timeout') || mensajeOriginal.includes('expired')) {
      this.errorMsg.set('⚠️ El tiempo de conexión ha expirado. Revisa tu señal de internet.');
    } else if (mensajeOriginal.includes('permission') || mensajeOriginal.includes('denied')) {
      this.errorMsg.set('⚠️ No hay permisos para acceder al GPS del teléfono.');
    } else if (mensajeOriginal.includes('network') || mensajeOriginal.includes('fetch')) {
      this.errorMsg.set('⚠️ Error de red. No se pudo conectar con Firebase/Supabase.');
    } else {
      this.errorMsg.set('⚠️ Ocurrió un inconveniente al procesar las coordenadas geográficas.');
    }
  }

  async detenerSeguimiento() {
    if (this.watchId) {
      await this.loc.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  ngOnDestroy() {
    if (this.watchId) {
      this.loc.clearWatch(this.watchId);
    }
  }
}