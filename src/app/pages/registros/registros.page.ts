import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonFab, IonFabButton, IonGrid, IonRow, IonCol, IonCard,
  IonCardContent, IonIcon, AlertController
} from '@ionic/angular/standalone'; 

import { EncuestaService, Encuesta } from '../../services/encuesta.service';
import { addIcons } from 'ionicons';
import { add, documentTextOutline, addCircleOutline } from 'ionicons/icons';

addIcons({
  add,
  documentTextOutline,
  addCircleOutline
});

@Component({
  selector: 'app-registros',
  templateUrl: './registros.page.html',
  styleUrls: ['./registros.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonFab,
    IonFabButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon
  ]
})
export class RegistrosPage implements OnInit {

  encuestas: Encuesta[] = [];

  constructor(
    private encuestaService: EncuestaService, 
    private alertController: AlertController
  ) {}

  imagenError(event: any) {
    event.target.src = 'assets/icon/image.png';
  }

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    try {
      this.encuestas = await this.encuestaService.obtenerEncuestas();
    } catch (error) {
      console.error('Error cargando los registros de encuestas:', error);
    }
  }

  async eliminar(id: string) {
    await this.encuestaService.eliminarEncuesta(id);
    await this.cargar();
  }

  async confirmarEliminar(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas eliminar este registro de encuesta?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
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