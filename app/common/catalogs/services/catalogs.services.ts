import { Injectable }    from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {CloudService} from "../../services/cloud.services";
import {CCatalog} from "../model/ccatalog";

@Injectable()
export class CatalogsService {

    private catalogsUrl = 'Catalogs';  // URL to web api
    error: any;

    constructor(private cloudService: CloudService) { }

    getCatalogs() {
        return this.cloudService
            .get(this.catalogsUrl)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(ccatalog: CCatalog) {
        return this.cloudService
            .save(this.catalogsUrl, ccatalog)
            .then(response => response)
            .catch(error => this.error = error);
    }
    
}

