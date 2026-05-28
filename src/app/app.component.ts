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
  clipboardSharp    
} from 'ionicons/icons';

import { AuthService } from './services/auth.service';
import { Title } from '@angular/platform-browser';

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

  // 💡 CORRECCIÓN: Dejamos 'search' limpio para que Ionic elija dinámicamente entre Outline y Sharp
  public appPages = [
    { title: 'Mi Perfil', url: '/perfil', icon: 'person-circle' },
    { title: 'Catálogo', url: '/catalogo', icon: 'musical-notes' },
    { title: 'Agregar Música', url: '/musica-form', icon: 'add-circle' },
    { title: 'GPS', url: '/gps', icon: 'location' }, 
    { title: 'Buscador', url: '/buscador', icon: 'search' }, 
    { title: 'Encuesta', url: '/encuesta', icon: 'clipboard' }, 
  ];

  constructor() {
    addIcons({
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
      clipboardSharp    
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const urlActual = event.urlAfterRedirects;

      const esLogin = urlActual.includes('/login');
      const esRegistro = urlActual.includes('/registrarse');
      const esRaiz = urlActual === '/';

      this.mostrarMenu = !(esLogin || esRegistro || esRaiz);
    });
  }

  async cerrarSesion() {
    await this.authService.logout();
  }
}