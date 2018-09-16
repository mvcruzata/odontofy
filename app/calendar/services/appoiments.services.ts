import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Appoiment} from "../model/appoiment";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class AppoitmentService {

    private url = 'Appoitment';  // URL to web api

    error: any;

    constructor(private cloudService: CloudService) { }

    getAppoitmentsByEmployeeId(id: number) {
        return this.cloudService
            .getById(this.url + "/GetAppoitmentByEmployeeId", id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getAppoitmentByClinicIdByEmployeeId(idClinic: number, idEmployee: number) {
        return this.cloudService
            .get(this.url + "/GetAppoitmentByClinicIdByEmployeeId/" + idClinic + "/" + idEmployee )
            .then(response => response)
            .catch(error => this.error = error);
    }

    getAppoitment(id: number) {
        return this.cloudService
            .getById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(appoiment: Appoiment) {
        return this.cloudService.save(this.url, appoiment);
    }

    delete(appoiment: Appoiment) {
        return this.cloudService.deleteById(this.url, appoiment.Id);
    }

}

