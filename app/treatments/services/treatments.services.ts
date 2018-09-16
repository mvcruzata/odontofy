import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Treatment} from "../model/treatment";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class TreatmentService {

    private url = 'Treatments';  // URL to web api
    treatments: Treatment[]; 
    error: any;

    constructor(private cloudService: CloudService) { }

    getTreatments() {
        return this.cloudService
            .get(this.url)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getTreatment(id: number) {
        return this.cloudService
            .getById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getTreatmentsByClinic(idClinic: number){
        return this.cloudService
            .get(this.url + '/GetByClinic/' + idClinic)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(treatment: Treatment) {
        return this.cloudService.save(this.url, treatment);
    }
    
    delete(id: number) {
        return this.cloudService
            .deleteById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    saveNewTreatmentType(treatmentType) {
        return this.cloudService.save(this.url, treatmentType);
    }

}

