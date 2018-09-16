import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class AccountingService {

    private url = 'Accounting';  // URL to web api

    error: any;

    constructor(private cloudService: CloudService) { }

    getAccountingByClinic(idClinic: number, status: string, startDate: string, endDate: string, query: string) {
        return this.cloudService
            .get(this.url + '/ByClinic/' + idClinic + '/' + status + '/' + startDate + '/' + endDate + '/' +  query)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getAccountingByPatient(idPatient: number, status: string) {
        return this.cloudService
            .get(this.url + '/ByPatient/' + idPatient + '/' + status )
            .then(response => response)
            .catch(error => this.error = error);
    }

}


