import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table'  

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(), 
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"apex-crm-89eb0","appId":"1:912187690095:web:9bb15e93404c4ce877919a","storageBucket":"apex-crm-89eb0.appspot.com","apiKey":"AIzaSyCpir9Dn8BobUrEFiudvMBr8LJX8KDry8Q","authDomain":"apex-crm-89eb0.firebaseapp.com","messagingSenderId":"912187690095"}))), 
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};

