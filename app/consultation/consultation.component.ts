import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute }  from '@angular/router';
import {DataTableDirectives} from 'angular2-datatable/datatable';
import {Response} from "../common/response/model/response";
import {ConsultationService} from "./services/consultation.services";
import {SpinnerComponent} from "../common/spinner/spinner.component";
import * as _ from 'lodash';

@Component({
    selector: 'consultation',
    templateUrl: './app/consultation/consultation.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives]
})
export class ConsultationComponent implements OnInit{
    title = 'Consultas';
    subtitle = 'Consultas';
    description_subtitle = 'Lista de consultas';

    sub: any;
    error: any;
    response: Response;

    @Output() close = new EventEmitter();

    public isRequesting: boolean = true;

    constructor(private router: Router, private route: ActivatedRoute, private diagnosisPlanService: ConsultationService) {
        this.response = new Response();
    }

    getConsultation(idPatient) {        
        this.diagnosisPlanService
            .getConsultationsByPatient(idPatient)
            .then(response => {
                this.response = response;
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    details(patient){
        //alert(patient.name);
    }

    execute(patient){
        //alert(patient.name);
    }
    
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                let id = +params['id'];
                this.getConsultation(id);
            }
        });
    }

    goBack() {
        window.history.back(); 
    }

}
