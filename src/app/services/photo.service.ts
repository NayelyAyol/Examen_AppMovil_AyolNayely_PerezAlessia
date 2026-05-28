import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
// CHANGE: Add import
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

    @Injectable({
    providedIn: 'root',
    })
    export class PhotoService {
    // Para guardar las fotos
    public photos: UserPhoto[] = [];

    private PHOTO_STORAGE: string = 'photos';

    // CHANGE: Add a property to track the app's running platform
    private platform: Platform;

    // CHANGE: Update constructor to set `platform`
    constructor(platform: Platform) {
        this.platform = platform;
    }

    // CHANGE: Update the `addNewToGallery()` method
    public async addNewToGallery() {
        // Take a photo
        const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
        saveToGallery: true,
        });

        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);

        Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos),
        });
    }

    // CHANGE: Update `savePicture()` method
    private async savePicture(photo: Photo) {
        let base64Data: string | Blob;
        // "hybrid" will detect mobile - iOS or Android
        if (this.platform.is('hybrid')) {
        const file = await Filesystem.readFile({
            path: photo.path!,
        });
        base64Data = file.data;
        } else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        base64Data = (await this.convertBlobToBase64(blob)) as string;
        }

        // Write the file to the data directory
        const fileName = `${Date.now()}-Ayol.${photo.format}`;
        const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
        });

        // CHANGE: Add platform check
        if (this.platform.is('hybrid')) {
        // Display the new image by rewriting the 'file://' path to HTTP
        return {
            filepath: savedFile.uri,
            webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        };
        } else {
        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
        }
    }

    // CHANGE: Add the `convertBlobToBase64` method
    private convertBlobToBase64(blob: Blob) {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
        });
    }

    public async loadSaved() {
        // Retrieve cached photo array data
        const { value: photoList } = await Preferences.get({
        key: this.PHOTO_STORAGE,
        });
        this.photos = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];

        // CHANGE: Display the photo by reading into base64 format
        for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
        });

        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        }
    }
    }

    // CHANGE: Add the `UserPhoto` interface
    export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
    }