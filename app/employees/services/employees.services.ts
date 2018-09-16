import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Employee} from "../model/employee";
import {CloudService} from "../../common/services/cloud.services";


@Injectable()
export class EmployeesService {

    private url = 'Employees';  // URL to web api
    error: any;

    constructor(private cloudService: CloudService) { }

    getEmployees() {
        return this.cloudService
            .get(this.url)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getEmployeesByClinic(idClinic: number, role: string) {
        return this.cloudService
            .get(this.url + '/EmployeesByClinic/'+ idClinic + '/' + role)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getEmployee(id: number) {
        console.log(this.url + '/EmployeesById');
        return this.cloudService
            .getById(this.url + '/EmployeesById', id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getEmployeeByPersonId(id: number) {
        return this.cloudService
            .getById(this.url + '/GetByPersonId', id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getEmployeeByGetByUserId(id: string) {
        return this.cloudService
            .get(this.url + '/GetByUserId/' + id)
            .then(response => response)
            .catch(error => this.error = error);
    }
    
    save(employee: Employee) {
        return this.cloudService.save(this.url, employee);
    }

    asociate(employee: Employee) {
        return this.cloudService.save(this.url + '/AsociateEmployee', employee);
    }

    delete(id: number) {
        return this.cloudService
            .deleteById(this.url + '/DeleteAsociate', id)
            .then(response => response)
            .catch(error => this.error = error);
    }

}



/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */