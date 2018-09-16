import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute  }  from '@angular/router';
import {Patient} from "../../model/patient";
import {Person} from "../../../profile/model/person";
import {Diagnosis_Plan} from "../../../diagnosis-plan/model/diagnosis-plan";
import {DiagnosisPlanService} from "../../../diagnosis-plan/services/diagnosis-plan.services";
import {PatientService} from "../../services/patients.services";
import {ProfileService} from "../../../profile/services/profile.services";
import {Response} from "../../../common/response/model/response";
import {OdontogramComponent} from '../../../odontogram/odontogram.component';
import {DataTableDirectives} from 'angular2-datatable/datatable';
import {AppGlobals} from "../../../common/globals/globals";

@Component({
    selector: 'patiens-view',
    templateUrl: './app/patients/data-personal/view/patiens-view.html', 
    styleUrls: ['./app/patients/data-personal/view/patiens-view.css'],
    directives: [ROUTER_DIRECTIVES, OdontogramComponent, DataTableDirectives]
})
export class PatiensViewComponent implements OnInit, OnDestroy {
    title = 'Información personal';

    @Input() patient: Patient;
    @Input() person: Person;
    @Output() close = new EventEmitter();
    navigated = false; 
    sub: any;
    vitalSigns:any;
    stomatognathicSystem: any;
    response: Response;
    private diagnosis_plans: Array<Diagnosis_Plan>;

    constructor(private router: Router, private route: ActivatedRoute, private appGlobals: AppGlobals,
        private patientService: PatientService, private profileService: ProfileService, private diagnosisPlanService: DiagnosisPlanService) {
    }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                let id = +params['id'];
                this.navigated = true;
                this.patient = new Patient();
                this.person = new Person();
                this.patientService.getPatient(id)
                    .then(patient => {
                        this.response = patient;
                        this.patient = this.response.Data;
                        this.person = this.patient.Person;
                        var datePipe = new DatePipe();
                        this.person.DateOfBirth = datePipe.transform(this.person.DateOfBirth,'yyyy-MM-dd');

                        this.patient.personalAndFamilyHistory = this.patient.Patients_Catalog_By_Type.PERSONALANDFAMILYHISTORY;
                        this.patient.vitalSigns = this.patient.Patients_Catalog_By_Type.VITALSIGNS;
                        this.patient.stomatognathicSystem = this.patient.Patients_Catalog_By_Type.STOMATOGNATHICSYSTEM;

                        //this.diagnosisPlanService.getDiagnosisPlansDataByPatient(id).then(response => {
                        //    this.diagnosis_plans = response.Data;
                        //}); 
                       
                    });
            } else {    
                this.navigated = false;
                this.patient = new Patient();
                this.person = new Person();

                this.patient.personalAndFamilyHistory = JSON.parse(localStorage.getItem('catalog')).Data.PERSONALANDFAMILYHISTORY;
                this.patient.vitalSigns = JSON.parse(localStorage.getItem('catalog')).Data.VITALSIGNS;
                this.patient.stomatognathicSystem = JSON.parse(localStorage.getItem('catalog')).Data.STOMATOGNATHICSYSTEM;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    cancel(savedPatient: Patient = null) {
        this.close.emit(savedPatient);
        if (this.navigated) { window.history.back(); }
    }

    goBack(savedPatient: Patient = null) {
        this.close.emit(savedPatient);
        if (this.navigated) { window.history.back(); }
    }

}

