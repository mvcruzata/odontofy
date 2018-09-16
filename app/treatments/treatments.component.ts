import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';
import {TreatmentService} from "./services/treatments.services";
import {Treatment} from "./model/treatment";
import {CloudService} from "../common/services/cloud.services";
import {SpinnerComponent} from "../common/spinner/spinner.component";
import {DataTableDirectives} from 'angular2-datatable/datatable';
import {Response} from "../common/response/model/response";
import {AppGlobals} from "../common/globals/globals";
import * as _ from 'lodash';
import { DataFilterPipe }   from './data-filter.pipe';


@Component({
    selector: 'treatments',
    templateUrl: './app/treatments/treatments.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives]
})
export class TreatmentsComponent implements OnInit {
    title = 'TRatamientos';
    subtitle = 'Tratamientos';
    description_subtitle = 'Configure los precios y descuentos de los tratamientos';

    @Input() treatment: Treatment;
    addingTreatment = false;
    public filterQuery = "";
    public specialitiesTypes: any;

    error: any;
    response: Response;

    public isRequesting: boolean = true;

    constructor(private treatmentService: TreatmentService, private appGlobals: AppGlobals) {
        this.response = new Response();
    }

    getTreatments() {
        var idCLinic = this.appGlobals.clinic.getValue().Id; 
        this.response = new Response();
        this.treatmentService
            .getTreatmentsByClinic(idCLinic)
            .then(response => {
                this.response = response;
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }
   
    edit(item){
       
    }

    delete(id) {
        this.treatmentService
            .delete(id)
            .then(response => {
                this.getTreatments();
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.isRequesting = true;
        this.getTreatments();
        this.specialitiesTypes = JSON.parse(localStorage.getItem('catalog')).Data.SPECIALTIES;
    }

    getSpeciality(id) {
        return this.specialitiesTypes.filter(x => x.Id == id)[0].Name;
    }
   
}

