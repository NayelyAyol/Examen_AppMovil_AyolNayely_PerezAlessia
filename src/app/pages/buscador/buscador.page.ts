import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 ¡Súper importante para que funcione el [(ngModel)]!
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonSearchbar, 
  IonSpinner, 
  IonList, 
  IonItem, 
  IonAvatar, 
  IonLabel, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone'; // 👈 Esto le avisa a Angular que use los componentes nativos de Ionic
import { ApiService, Cancion } from '../../services/api'; // Tu importación original limpia

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
  standalone: true, // 👈 Convertimos la página a Standalone
  imports: [
    CommonModule,
    FormsModule, // 👈 Registramos el módulo de formularios aquí
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonSpinner,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonButton,
    IonIcon
  ]
})
export class BuscadorPage implements OnInit {
  terminoBusqueda: string = '';
  listaCanciones: Cancion[] = [];
  cargando: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.buscarMusica('Rock');
  }

  async buscarMusica(termino: string) {
    if (!termino.trim()) return;
    
    this.cargando = true;
    try {
      this.listaCanciones = await this.apiService.buscarMusica(termino);
    } catch (error) {
      console.error('Error al traer la música de la API:', error);
    } finally {
      this.cargando = false;
    }
  }
}