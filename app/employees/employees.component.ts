import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router }  from '@angular/router';
import { SpinnerComponent} from "../common/spinner/spinner.component";
import { DataTableDirectives} from 'angular2-datatable/datatable';
import { EmployeesService} from "./services/employees.services";
import { Response} from "../common/response/model/response";
import { AppGlobals} from "../common/globals/globals";
import * as _ from 'lodash';


@Component({
    selector: 'treatments',
    templateUrl: './app/employees/employees.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives]
})
export class EmployeesComponent implements OnInit {
    subtitle = 'Empleados';

    error: any;
    response: Response;
    public isRequesting: boolean = true;
    idClinic: number;

    constructor(private employeesService: EmployeesService, private router: Router, private appGlobals: AppGlobals) {
        this.response = new Response();
    }

    getEmployees() {
        this.idClinic = this.appGlobals.clinic.getValue().Id;
        this.response = new Response();
        this.employeesService
            .getEmployeesByClinic(this.idClinic, 'ALL')
            .then(response => {
                this.response = response;
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    delete(id) {        
        this.employeesService
            .delete(id)
            .then(response => {
                this.getEmployees();
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    ngOnInit() {
       this.getEmployees();
    }

}

