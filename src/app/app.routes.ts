import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalogo/catalogo.page').then(m => m.CatalogoPage)
  },
  {
    path: 'musica-form',
    loadComponent: () => import('./pages/musica-form/musica-form.page').then(m => m.MusicaFormPage)
  },
  {
    path: 'musica-form/:id',
    loadComponent: () => import('./pages/musica-form/musica-form.page').then(m => m.MusicaFormPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'gps',
    loadComponent: () => import('./pages/gps/gps.page').then( m => m.GpsPage)
  },
  {
    path: 'buscador',
    loadComponent: () => import('./pages/buscador/buscador.page').then( m => m.BuscadorPage)
  },  {
    path: 'encuesta',
    loadComponent: () => import('./pages/encuesta/encuesta.page').then( m => m.EncuestaPage)
  },
  {
    path: 'camara',
    loadComponent: () => import('./pages/camara/camara.page').then( m => m.CamaraPage)
  }

];