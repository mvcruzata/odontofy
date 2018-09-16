import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { CloudService } from "../../common/services/cloud.services";

@Injectable()
export class BillingService {

    private url = 'Billing';  // URL to web api

    error: any;

    constructor(private cloudService: CloudService) { }

    getBillingMyMonth(idClinic: number) {
        return this.cloudService
            .get(this.url + '/GetBillingMyMonth/' + idClinic)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getByPatientPartnetship(idClinic: number, month: number, year: number) {
        return this.cloudService
            .get(this.url + '/GetByPatient/Partnetship/' + idClinic + "/" + month + "/" + year)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getPaymentsByClinicByEmploye(idClinic: number, month: number, year: number) {
        return this.cloudService
            .get(this.url + '/GetPayments/ByClinic/ByEmploye/' + idClinic + "/" + month + "/" + year)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getBillingByClinic(idClinic: number) {
        return this.cloudService
            .get(this.url + '/ByClinic/' + idClinic)
            .then(response => response)
            .catch(error => this.error = error);
    }


}

