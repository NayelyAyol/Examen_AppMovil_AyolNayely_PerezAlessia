import { Component, inject, NgZone } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonInputPasswordToggle,
  ToastController,
  IonIcon
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Tu servicio de autenticación
import { addIcons } from 'ionicons';
import { gameController } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonInputPasswordToggle,
    IonIcon
  ]
})
export class LoginPage {
  constructor() {
    addIcons({ gameController });
  }

  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private ngZone = inject(NgZone);

  async mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'error') {
    try {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 2200,
        position: 'top',
        cssClass: tipo === 'success' ? 'toast-success' : 'toast-error',
      });
      await toast.present();
    } catch (e) {
      console.error('Fallo el Toast nativo:', e);
      alert(mensaje);
    }
  }

  async login() {
    if (!this.email.trim() || !this.password.trim()) {
      await this.mostrarToast('Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      
      this.ngZone.run(async () => {
        await this.mostrarToast('Inicio de sesión correcto', 'success');
        
        setTimeout(async () => {
          await this.router.navigate(['/perfil'], { replaceUrl: true });
        }, 200);
      });

    } catch (error: any) {
      await this.mostrarToast(error.message || 'Error al iniciar sesión', 'error');
    }
  }

  register() {
    this.router.navigateByUrl('/registrarse');
  }
}