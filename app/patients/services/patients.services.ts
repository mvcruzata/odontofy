import { Injectable }    from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Patient } from "../model/patient";
import { Person } from "../../profile/model/person";
import {CloudService} from "../../common/services/cloud.services";


@Injectable()
export class PatientService {

    private url = 'Patients';  // URL to web api
    error: any;

    constructor(private cloudService: CloudService) { }

    getPatients() {
        return this.cloudService
            .get(this.url)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getByIdClinicByIdEmployee(idClinic: number, idEmployee: number, start: string, end: string, query: string) {
        return this.cloudService
            .get(this.url + "/GetByIdClinicByIdEmployee/" + idClinic + '/' + idEmployee + "/"+ start + '/' + end + '/' + query)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getPatient(id: number) {
        return this.cloudService
            .getById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(patient: Patient) {
        return this.cloudService.save(this.url, patient);
    }

    delete(id: number) {
        return this.cloudService.deleteById(this.url, id);
    }
    
}

