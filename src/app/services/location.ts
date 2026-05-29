import { Injectable } from '@angular/core';
import { Geolocation, PermissionStatus, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class LocationService {

  async ensurePermissions(): Promise<any> {
    if (!Capacitor.isNativePlatform()) {
      return { location: 'granted', coarseLocation: 'granted' };
    }
    
    const perm = await Geolocation.checkPermissions();
    if (perm.location === 'granted' || perm.coarseLocation === 'granted') return perm;
    return Geolocation.requestPermissions();
  }

  async getCurrentPosition(): Promise<any> {
    if (!Capacitor.isNativePlatform()) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              coords: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                altitude: pos.coords.altitude,
                altitudeAccuracy: pos.coords.altitudeAccuracy,
                heading: pos.coords.heading,
                speed: pos.coords.speed
              },
              timestamp: pos.timestamp
            });
          },
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    }

    return Geolocation.getCurrentPosition({ enableHighAccuracy: true });
  }

  async watchPosition(onPos: (p: Position) => void, onErr?: (e: any) => void): Promise<string> {
    if (!Capacitor.isNativePlatform()) {
      const id = navigator.geolocation.watchPosition(
        (pos) => onPos(pos as unknown as Position),
        (err) => { if (onErr) onErr(err); },
        { enableHighAccuracy: true }
      );
      return id.toString();
    }

    const id = await Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (pos, err) => {
        if (pos) onPos(pos);
        else if (err && onErr) onErr(err);
      }
    );
    return id as unknown as string;
  }

  async clearWatch(id: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      navigator.geolocation.clearWatch(parseInt(id, 10));
      return;
    }
    await Geolocation.clearWatch({ id });
  }
}