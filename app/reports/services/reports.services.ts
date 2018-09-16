import { Injectable }    from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {CloudService} from "../../common/services/cloud.services";


@Injectable()
export class ReportService {

    private url = 'Reports';  // URL to web api
    error: any;

    constructor(private cloudService: CloudService) { }
    
    getSalesByYear(idClinic: number) {
        return this.cloudService
            .get(this.url + "/GetSalesByYear/" + idClinic)
            .then(response => response)
            .catch(error => this.error = error);
    }
    
}

