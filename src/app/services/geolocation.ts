import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  async obtenerUbicacion() {
    await Geolocation.requestPermissions();

    const coordenadas = await Geolocation.getCurrentPosition();

    return {
      latitud: coordenadas.coords.latitude,
      longitud: coordenadas.coords.longitude
    };
  }
}