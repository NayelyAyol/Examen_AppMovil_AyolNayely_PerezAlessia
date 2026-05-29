import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { filter } from 'rxjs/operators';

import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  musicalNotesOutline,
  musicalNotesSharp,
  addCircleOutline,
  addCircleSharp,
  personCircleOutline,
  personCircleSharp,
  logOutOutline,
  logOutSharp,
  locationOutline,
  locationSharp,
  searchOutline, 
  searchSharp, 
  clipboard,
  clipboardSharp,
  apertureOutline,
  apertureSharp,
  documentTextOutline,
  documentTextSharp,
  gameControllerOutline,
  gameControllerSharp
} from 'ionicons/icons';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true, 
  imports: [
    CommonModule, 
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet
  ],
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  mostrarMenu = false;

  public appPages = [
    { title: 'Mi Perfil', url: '/perfil', icon: 'person-circle' },
    { title: 'Registros', url: '/registros', icon: 'document-text' }, 
    { title: 'Encuesta', url: '/encuesta', icon: 'clipboard' }, 
  ];

  constructor() {
    addIcons({
      'person-circle': personCircleOutline,
      'person-circle-outline': personCircleOutline,
      'person-circle-sharp': personCircleSharp,
      'musical-notes': musicalNotesOutline,
      'musical-notes-outline': musicalNotesOutline,
      'musical-notes-sharp': musicalNotesSharp,
      'add-circle': addCircleOutline,
      'add-circle-outline': addCircleOutline,
      'add-circle-sharp': addCircleSharp,
      'location': locationOutline,
      'location-outline': locationOutline,
      'location-sharp': locationSharp,
      'search': searchOutline,
      'search-outline': searchOutline,
      'search-sharp': searchSharp,
      'clipboard': clipboard,
      'clipboard-outline': clipboard,
      'clipboard-sharp': clipboardSharp,
      'aperture': apertureOutline,
      'aperture-outline': apertureOutline,
      'aperture-sharp': apertureSharp,
      'document-text': documentTextOutline,
      'document-text-outline': documentTextOutline,
      'document-text-sharp': documentTextSharp,
      'log-out': logOutOutline, 
      'log-out-outline': logOutOutline,
      'log-out-sharp': logOutSharp,
      'game-controller': gameControllerOutline,
      'game-controller-outline': gameControllerOutline,
      'game-controller-sharp': gameControllerSharp,
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const urlActual = event.urlAfterRedirects;

      const esLogin = urlActual.includes('/login');
      const esRegistro = urlActual.includes('/registrarse') || urlActual.includes('/register');
      const esRaiz = urlActual === '/';

      this.mostrarMenu = !(esLogin || esRegistro || esRaiz);
    });
  }

  async cerrarSesion() {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}