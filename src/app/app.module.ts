import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {CoreModule} from './core/core.module';

const firebaseConfig = {
    apiKey: 'AIzaSyBEoFcaWzgF9f5vPW7tfpETDa_eoSwEs8U',
    authDomain: 'fir-test-a548b.firebaseapp.com',
    databaseURL: 'https://fir-test-a548b.firebaseio.com',
    projectId: 'fir-test-a548b',
    storageBucket: 'fir-test-a548b.appspot.com',
    messagingSenderId: '891543863988',
    appId: '1:891543863988:web:bb852477cd5c7d25884de1',
    measurementId: 'G-WN1S8PMTM9'
};

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule,
        IonicModule.forRoot(), AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        CoreModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
