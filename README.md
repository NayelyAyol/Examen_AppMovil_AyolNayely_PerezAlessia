<h1 align="center"> 🎮 Game Survey Campus 🕹️ </h1>
<p align="center">Examen Bimestral - Desarrollo de Aplicaciones Móviles GR1</p>

## Descripción
**Game Survey Campus** es una aplicación móvil desarrollada en **Ionic con Angular** para la recolección de datos de campo en la Escuela de Formación de Tecnólogos. La app permite registrar interacciones con la comunidad universitaria, capturando: 
- Preferencias de videojuegos
- Evidencias fotográficas
- GPS
- Consumo de API externa

---
## Autoras
- Nayely Ayol
- Alessia Pérez

---
## Tecnologías y Herramientas
* **Framework:** Ionic v7+ / Angular 18+
* **Backend:** Supabase (Auth, Database, Storage)
* **API de Videojuegos:** RAWG
* **Plugins de Capacitor:** Camera, Geolocation, Filesystem
* **Despliegue:** Firebase Hosting (Dashboard)
* **Gestión de Assets:** `@capacitor/assets`

---

## Configuración del Backend (Supabase)

Para el almacenamiento de datos y archivos se configuró el proyecto en Supabase:

1. **Database:** Se creó la tabla `encuestas` con la siguiente estructura SQL:

```sql
create table encuestas (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users(id) on delete cascade,

  nombre_alias text not null,
  edad_rango text not null,
  rol text not null,
  videojuego_favorito text not null,
  plataforma text not null,
  genero text not null,
  comentario text,

  latitud float8,
  longitud float8,
  lugar_campus text,
  fecha_hora timestamp with time zone default now(),

  foto_url text,

  juego_imagen_url text,
  juego_genero_api text,
  juego_plataforma_api text,
  juego_descripcion text,
  juego_rating text,

  created_at timestamp with time zone default now()
);

```


3. **Storage:** Se creó un bucket público llamado `fotos-encuestas` con *Policies* habilitadas para permitir la subida de imágenes (`.jpg`, `.png`) por usuarios.

<img width="1036" height="551" alt="image" src="https://github.com/user-attachments/assets/9333c285-bfe0-4d6a-9d0c-c7558e982fbb" />


---

## Consumo de API

Se consumió la **RAWG API** para obtener datos enriquecidos.

**Endpoint:**
- `https://api.rawg.io/api/games?search={nombre}`


**Datos obtenidos:** Se mapean los campos
- name
- background_image
- genres
- platforms
- rating

para mostrar una ficha técnica completa del videojuego registrado por el usuario.

---

## Proceso de Desarrollo

1. **Instalación de Dependencias:**
```bash
npm install @capacitor/camera @capacitor/geolocation @supabase/supabase-js
npm install -D @capacitor/assets

```

2. **Configuración Nativa:** Se configuraron los recursos nativos ejecutando `npx @capacitor/assets generate` tras organizar los archivos en la carpeta `/resources`.
- Se guarda un archivo denominado icon.png de 1024 x 1024 px.
4. **Lógica de Cámara/GPS:** Se implementó el servicio de geolocalización para capturar coordenadas `latitude` y `longitude` en el momento exacto del `click` en el botón de registro.

---

## Trabajo de Campo

Cumplimiento de objetivos:

* **50+ Encuestas:** Datos validados en el servidor Supabase.
* **50 Ubicaciones:** Registros GPS únicos distribuidos en el campus.
* **20+ Juegos distintos:** Identificados mediante la API.
* **50 Evidencias:** Imágenes alojadas en el bucket de Supabase.

Supabase:

<img width="1076" height="837" alt="image" src="https://github.com/user-attachments/assets/6f63dde6-5f58-40a8-a297-04b380cfe70e" />


Video de la actividad:

[![Ver en reel](https://img.shields.io/badge/Ver_Reel-black?style=for-the-badge&logo=tiktok)](https://www.instagram.com/reel/DY7vYFpyLgm/?igsh=Nml1b21zNTEyNzJu)
---

## Capturas de Funcionalidad

| Login | Formulario de Registro |
| --- | --- |
| <img width="302" height="644" alt="image" src="https://github.com/user-attachments/assets/b044396a-bf1b-4de3-af32-51bcd996b42c" />| <img width="302" height="644" alt="image" src="https://github.com/user-attachments/assets/7bbe5482-90a5-497d-b622-03f0a918a1cd" />|

| Pantalla de presentación | Perfil |
| --- | --- |
| <img width="302" height="644" alt="image" src="https://github.com/user-attachments/assets/e4183fef-5203-4fa0-8935-53ebf12ce810" />| <img width="302" height="644" alt="image" src="https://github.com/user-attachments/assets/665f366b-9dd8-429e-bca6-0c9aba1a1836" />|

| Menú Lateral | Encuesta |
| --- | --- |
| <img width="302" height="644" alt="image" src="https://github.com/user-attachments/assets/1533531f-0f1e-4bdc-8fbb-886d45f82489" />| <img width="302" height="644" alt="image" src="https://github.com/user-attachments/assets/5bc3a218-0b4a-4b69-917b-c7256b20b391" />|

| Catálogo de Registros | Modal de eliminación |
| --- | --- |
| <img width="302" height="644" alt="image" src="https://github.com/user-attachments/assets/60dc84a8-f240-4049-8e3f-5dc306f613b3" />| <img width="302" height="644" alt="image" src="https://github.com/user-attachments/assets/7d298b7e-ea52-469e-8823-51ab5ef025de" />|

---

## Despliegue y Promoción

La aplicación fue distribuida mediante descarga directa de APK y mediante un tablero de visualización en:

**Firebase Hosting**.

[![Despliegue](https://img.shields.io/badge/Despliegue-blue?style=for-the-badge&logo=android)](https://examen-movil-e2d74.web.app/)

### Pantalla de Bienvenida

<img width="1279" height="894" alt="image" src="https://github.com/user-attachments/assets/2bcafef6-c2a9-41f6-999d-387a98aeb499" />

Descargar el APK:

<img width="533" height="509" alt="image" src="https://github.com/user-attachments/assets/01d4027b-dfd7-4526-bdc2-28f488fd8e16" />

Despliegue de la App:

[![Despliegue](https://img.shields.io/badge/Despliegue-blue?style=for-the-badge&logo=android)](https://encuesta-videojuego.web.app/welcome)
