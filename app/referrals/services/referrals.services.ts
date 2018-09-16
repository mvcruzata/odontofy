import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Referred} from "../model/referred";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class ReferralsService {

    private url = 'Referrals';  // URL to web api
    referred: Referred[]; 
    error: any;

    constructor(private cloudService: CloudService) { }

    getReferrals() {
        return this.cloudService
            .get(this.url)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getReferral(id: number) {
        return this.cloudService
            .getById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getReferralsByUser(idPerson: number) {
        return this.cloudService
            .get(this.url + '/GetByUser/' + idPerson)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(referred: Referred) {
        return this.cloudService.save(this.url, referred);
    }

    saveReferral(referred: Referred) {
        return this.cloudService.save(this.url + "/Register", referred);
    }
    
    delete(id: number) {
        return this.cloudService
            .deleteById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }
    
}

