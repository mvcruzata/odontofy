import { Injectable }    from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {File} from "../model/file";
import { CloudService } from "../../common/services/cloud.services";


@Injectable()
export class FileService {

    private url = 'File';  // URL to web api
    error: any;

    constructor(private cloudService: CloudService) { }

    getFiles() {
        return this.cloudService
            .get(this.url)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getFileByModelId(Model: string, Id: number) {
        return this.cloudService
            .getById(this.url + "/ByModelId/" + Model + "/", Id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getFileById(Id: number) {
        return this.cloudService
            .getById(this.url + "/ById/", Id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getPatient(id: number) {
        return this.cloudService
            .getById(this.url, id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    save(file: File) {
        return this.cloudService.save(this.url, file);
    }

    delete(Id: number) {
        return this.cloudService
            .deleteById(this.url, Id)
            .then(response => response)
            .catch(error => this.error = error);        
    }
    
}

