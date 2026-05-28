import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCardContent,
  IonIcon,
  IonCard,
  IonAlert
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    CommonModule,
    IonCardContent,
    IonIcon,
    IonCard,
    IonAlert
  ]
})
export class PerfilPage implements OnInit {
  nombre = '';
  apellido = '';
  email = '';
  mostrarAlerta = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.mostrarAlerta = false;
      }
    },
    {
      text: 'Salir',
      cssClass: 'alert-btn-danger',
      handler: () => {
        this.logout();
      }
    }
  ];

  constructor() {
    // Registramos el icono del avatar de forma nativa
    addIcons({ personCircleOutline });
  }

  async ngOnInit() {
      // CORRECCIÓN AQUÍ: Cambiamos obtainCurrentUser() por obtenerUsuarioActual()
      const user = await this.authService.obtenerUsuarioActual();
      if (user) {
        // Extraemos las propiedades tal cual las configuramos en tu Auth con opciones data
        this.nombre = user.user_metadata?.['first_name'] || '';
        this.apellido = user.user_metadata?.['last_name'] || '';
        this.email = user.email || '';
      }
    }

  abrirAlertaLogout() {
    this.mostrarAlerta = true;
  }

  async logout() {
    await this.authService.logout();
  }
}