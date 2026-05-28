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
  ToastController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonInputPasswordToggle
  ]
})
export class RegisterPage {
  nombre = '';
  apellido = '';
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

  async register() {
    // 1. Validar campos vacíos
    if (!this.nombre.trim() || !this.apellido.trim() || !this.email.trim() || !this.password.trim()) {
      await this.mostrarToast('Todos los campos son obligatorios', 'error');
      return;
    }

    // 2. Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.mostrarToast('Por favor, ingresa un correo electrónico válido', 'error');
      return;
    }

    // 3. Validar longitud de la contraseña
    if (this.password.length < 6) {
      await this.mostrarToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    try {
      await this.authService.register(this.nombre, this.apellido, this.email, this.password);
      
      this.ngZone.run(async () => {
        await this.mostrarToast('Usuario registrado correctamente', 'success');
        setTimeout(async () => {
          await this.router.navigate(['/login']);
        }, 1500);
      });
    } catch (error: any) {
      await this.mostrarToast(error.message || 'Error en el registro', 'error');
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}