import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Person} from "../model/person";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class ProfileService {

    private url = 'Profile';  
    private urlCatalog = 'Catalogs'; 
    error: any;

    constructor(private cloudService: CloudService) { }

    getPersons() {
        return this.cloudService
            .get(this.url)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getProfilebyId(id: number) {
        return this.cloudService
            .getById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getProfilebyUserId(id) {
        return this.cloudService
            .get(this.url + "/UserId/"+ id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getPersonByEmployeId(id) {
        return this.cloudService
            .get(this.url + "/Person/ByEmployeId/" + id)
            .then(response => response)
            .catch(error => this.error = error);
    }
    

    save(profile: Person) {
        return this.cloudService.save(this.url, profile);
    }

    delete() {
       
    }

    getAllCatalogs() {
        return this.cloudService.get(this.urlCatalog + '/GetAll')
            .then(response => response)
            .catch(error => this.error = error);
    }
}



/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */