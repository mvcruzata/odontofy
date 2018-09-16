import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Clinic} from "../model/clinic";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class ClinicService {

    private url = 'Clinic';  
    error: any;

    constructor(private cloudService: CloudService) { }

    getClinics() {
        return this.cloudService
            .get(this.url)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getByOwnerId(id: number) {
        return this.cloudService
            .getById(this.url + '/GetByOwnerId', id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getClinicById(id: number) {
        return this.cloudService
            .getById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(clinic: Clinic) {
        return this.cloudService.save(this.url, clinic);
    }

    delete() {
       
    }

}

