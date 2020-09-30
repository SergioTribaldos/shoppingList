import {Injectable} from '@angular/core';
import {AlertController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(public alertController: AlertController) {
    }

    async createAlert(config) {
        const alert = await this.alertController.create(config);

        await alert.present();
    }
}
