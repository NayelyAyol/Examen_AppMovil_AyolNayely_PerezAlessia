import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonButton
} from '@ionic/angular/standalone';

import { EncuestaService, Encuesta } from '../../services/encuesta.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonButton
  ]
})
export class EncuestaPage {

  encuesta: Encuesta = {
    nombre_alias: '',
    edad_rango: '',
    rol: '',
    videojuego_favorito: '',
    plataforma: '',
    genero: '',
    comentario: ''
  };

  roles = ['Estudiante', 'Docente', 'Administrativo', 'Visitante'];

  edades = [
    'Menos de 15 años',
    '15 a 18 años',
    '19 a 25 años',
    '26 a 35 años',
    'Más de 35 años'
  ];

  plataformas = ['Móvil', 'Consola', 'PC', 'Navegador'];

  generos = [
    'Acción',
    'Aventura',
    'Deportes',
    'Estrategia',
    'RPG',
    'Terror',
    'Simulación',
    'Otro'
  ];

  constructor(private encuestaService: EncuestaService) { }

  async guardarEncuesta() {
    try {
      await this.encuestaService.crearEncuesta(this.encuesta);
      alert('Encuesta guardada correctamente');

      this.encuesta = {
        nombre_alias: '',
        edad_rango: '',
        rol: '',
        videojuego_favorito: '',
        plataforma: '',
        genero: '',
        comentario: ''
      };

    } catch (error) {
      console.error(error);
      alert('No se pudo guardar la encuesta');
    }
  }
}