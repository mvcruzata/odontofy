import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Consultation} from "../model/consultation";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class ConsultationService {

    private url = 'Consultation/';  // URL to web api
    consultations: Consultation[]; 
    error: any;

    constructor(private cloudService: CloudService) { }

    getConsultationsByDiagnosticPlanId(id:number) {
        return this.cloudService
            .get(this.url + 'GetConsultationByDiagnosisPlan/' + id) 
            .then(response => response)
            .catch(error => this.error = error);
    }

    getConsultationsByPatient(id: number) {
        return this.cloudService
            .get(this.url + 'ConsultationsByDiagnosticPlanId/' + id)
            .then(response => response)
            .catch(error => this.error = error);
    }
    
    getConsultationById(id: number) {
        return this.cloudService
            .getById(this.url + 'ConsultationById', id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(consultation: Consultation) {
        return this.cloudService.save(this.url, consultation);
    }

    delete(consultation: Consultation) {
       
    }

}



/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */