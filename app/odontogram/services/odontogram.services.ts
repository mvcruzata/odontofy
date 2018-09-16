import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Odontogram} from "../model/odontogram";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class OdontogramService {

    private url = 'Odontogram';  // URL to web api
    error: any;

    constructor(private cloudService: CloudService) { }

    getOdontogramByPatientId(idPatient: number) {
        return this.cloudService
            .getById(this.url + "/GetByPatientId", idPatient)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getOdontogramHistory(id: number) {
        return this.cloudService
            .getById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(odontogram: Odontogram) {
        return this.cloudService.save(this.url, odontogram);
    }

}

