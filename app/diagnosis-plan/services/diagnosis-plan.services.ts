import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Diagnosis_Plan} from "../model/diagnosis-plan";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class DiagnosisPlanService {

    private url = 'Patients/';  // URL to web api
    diagnosisPlans: Diagnosis_Plan[]; 
    error: any;

    constructor(private cloudService: CloudService) { }

    getDiagnosisPlansByPatient(id:number) {
        return this.cloudService
            .get(this.url + 'DiagnosisPlan/' + id) 
            .then(response => response)
            .catch(error => this.error = error);
    }

    getDiagnosisPlansDataByPatient(id: number) {
        return this.cloudService
            .get(this.url + 'DiagnosisPlanData/' + id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getDiagnosisPlanById(id: number) {
        return this.cloudService
            .getById(this.url + 'DiagnosisPlanById', id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(diagnosisPlan: Diagnosis_Plan) {
        return this.cloudService.save(this.url + 'DiagnosisPlan', diagnosisPlan);
    }

    delete(id: number) {
        return this.cloudService
            .deleteById(this.url + 'DiagnosisPlanDelete', id)
            .then(response => response)
            .catch(error => this.error = error);
    }

}

