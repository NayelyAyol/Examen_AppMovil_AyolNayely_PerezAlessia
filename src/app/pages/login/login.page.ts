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
import { AuthService } from '../../services/auth.service'; // Tu servicio de autenticación

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
    IonInputPasswordToggle
  ]
})
export class LoginPage {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private ngZone = inject(NgZone);

  // Implementamos tu función de Toast dinámico para el Login
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
          // Te manda al catálogo limpiando el historial para que no se pueda volver atrás con el botón físico
          await this.router.navigate(['/catalogo'], { replaceUrl: true });
        }, 200);
      });

    } catch (error: any) {
      await this.mostrarToast(error.message || 'Error al iniciar sesión', 'error');
    }
  }

  // CORRECCIÓN AQUÍ: Ya no registra desde aquí, ahora redirige a tu nueva página hermosa de registro
  register() {
    this.router.navigateByUrl('/registrarse');
  }
}