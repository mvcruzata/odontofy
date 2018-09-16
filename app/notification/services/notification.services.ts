import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class NotificationService {

    private url = 'Notification/';  // URL to web api
    error: any;

    constructor(private cloudService: CloudService) { }
    
    getNotificationsByClinicId(ClinicId: number, idEmploye: number) {
        return this.cloudService
            .get(this.url + ClinicId + '/' + idEmploye)
            .then(response => response)
            .catch(error => this.error = error);
    }
        
}
