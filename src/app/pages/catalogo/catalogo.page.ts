import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonFab, IonFabButton, IonGrid, IonRow, IonCol, IonCard,
  IonCardContent, IonIcon, 
  AlertController
} from '@ionic/angular/standalone'; 

import { RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common'; // <-- CORRECCIÓN: Añadidos NgFor y NgIf explícitos para standalone
import { CancionService, Cancion } from '../../services/musica';
import { AuthService } from '../../services/auth.service'; 
import { addIcons } from 'ionicons';
import { add, musicalNotesOutline, addCircleOutline } from 'ionicons/icons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface CancionVista extends Cancion {
  videoEmbedUrl?: SafeResourceUrl;
}

addIcons({
  add,
  musicalNotesOutline,
  addCircleOutline
});

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgFor, // <-- AGREGADO: Para dar soporte estricto al *ngFor de tus columnas
    NgIf,  // <-- AGREGADO: Para dar soporte estricto al *ngIf de tus videos y audios
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
    IonFab, IonFabButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon
  ]
})
export class CatalogoPage implements OnInit {

  canciones: CancionVista[] = [];

  constructor(
    private cancionService: CancionService, 
    private authService: AuthService, 
    private alertController: AlertController,
    private sanitizer: DomSanitizer
  ) {}

  imagenError(event: any) {
    event.target.src = 'assets/icon/image.png';
  }

  procesarVideoUrl(url: string): SafeResourceUrl {
    let videoId = '';
    if (!url) return '';

    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1];
      if (videoId.includes('&')) {
        videoId = videoId.split('&')[0];
      }
    }
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&showinfo=0&autoplay=0`
    );
  }

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    const usuario = await this.authService.obtenerUsuarioActual();
    
    if (usuario) {
      const listaOriginal = await this.cancionService.listar(usuario.id);
      
      this.canciones = listaOriginal.map(cancion => ({
        ...cancion,
        videoEmbedUrl: cancion.video_url ? this.procesarVideoUrl(cancion.video_url) : undefined
      }));
    }
  }

  async eliminar(id: number) {
    await this.cancionService.eliminar(id);
    await this.cargar();
  }

  async confirmarEliminar(id: number) {
    const alert = await this.alertController.create({
      message: '¿Deseas eliminar esta canción?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Aceptar',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            await this.eliminar(id);
          }
        }
      ]
    });

    await alert.present();
  }
}