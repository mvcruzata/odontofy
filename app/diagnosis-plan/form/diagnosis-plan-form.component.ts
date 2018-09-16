import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Diagnosis_Plan } from "../model/diagnosis-plan";
import { DiagnosisPlanService } from "../services/diagnosis-plan.services";
import { TreatmentService } from "../../treatments/services/treatments.services";
import { Treatment } from "../../treatments/model/treatment";
import { AppGlobals } from "../../common/globals/globals";
import { SpinnerComponent } from "../../common/spinner/spinner.component";
import { NotificationMessage } from "../../common/notification/notification.services";


@Component({
    selector: 'diagnosis-plan-form',
    templateUrl: './app/diagnosis-plan/form/diagnosis-plan-form.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent]
})
export class DiagnosisPlanFormComponent implements OnInit {

    @Input() diagnosisPlan: Diagnosis_Plan;
    @Output() close = new EventEmitter();
    @Output() response = new EventEmitter();

    navigated = false;
    sub: any;
    treatments: Treatment[];
    treatmentsAll: Treatment[];
    public id: number;
    discount: number;
    price: number;
    public isRequesting: boolean;
    public specialitiesTypes: any;
    error: any;

    constructor(private router: Router, private route: ActivatedRoute, private appGlobals: AppGlobals,
        private diagnosisPlanService: DiagnosisPlanService, private treatmentService: TreatmentService, private notification: NotificationMessage) {
    }

    ngOnInit() {
        this.specialitiesTypes = JSON.parse(localStorage.getItem('catalog')).Data.SPECIALTIES;
        this.diagnosisPlan = new Diagnosis_Plan();
        var idClinic = this.appGlobals.clinic.getValue().Id;
        this.treatmentService.getTreatmentsByClinic(idClinic)
            .then(treatments => {
                this.treatmentsAll = treatments.Data;
                this.treatments = treatments.Data;
            });
    }
    
    save() {
        this.isRequesting = true;
        this.diagnosisPlan.DoctorDiagnosticId = JSON.parse(localStorage.getItem('user')).Data.Employees[0].Id;
        this.diagnosisPlan.DoctorExecuteId = this.diagnosisPlan.DoctorDiagnosticId;
        this.diagnosisPlan.PatientId = this.appGlobals.patient.getValue().Id;
        this.diagnosisPlan.Tooth = "4C";

        if (this.diagnosisPlan.ValueType == 3) {
            this.diagnosisPlan.PercentSpecialDiscount = this.diagnosisPlan.TreatmentAmount / this.price * 100;
        }

        this.diagnosisPlanService.save(this.diagnosisPlan)
            .then(diagnosisPlan => {
                this.notification.notifySuccess("Guardar plan diagn&oacute;stico");
                this.diagnosisPlanService
                    .getDiagnosisPlansByPatient(this.diagnosisPlan.PatientId)
                    .then(response => {
                        this.response.emit(response);
                    })
                    .catch(error => this.error = error);
                this.isRequesting = false;
            });
    }

    goBack(diagnosisPlan: Diagnosis_Plan = null) {
        this.close.emit(diagnosisPlan);
        if (this.navigated) { window.history.back(); }
    }

    getAmount(typeValue) {
        this.diagnosisPlan.PercentDiscountStablished = 0;
        this.diagnosisPlan.ValueType = typeValue;
        
        for (var i = 0; i < this.treatments.length; i++) {
            if (this.treatments[i].Id == this.diagnosisPlan.TreatmentId) {
                this.price = this.treatments[i].Price;
                if (typeValue == 1) {
                    this.diagnosisPlan.TreatmentAmount = this.treatments[i].Price;
                }
                if (typeValue == 2) {
                    this.diagnosisPlan.TreatmentAmount = this.diagnosisPlan.TreatmentAmount - this.treatments[i].Price * this.treatments[i].Discount / 100;
                    this.diagnosisPlan.PercentDiscountStablished = this.treatments[i].Discount;
                }
                if (typeValue == 3) {
                    this.diagnosisPlan.PercentSpecialDiscount = this.diagnosisPlan.TreatmentAmount / this.treatments[i].Price * 100;
                }
            }
        }
    }

    cancel() {
        if (this.navigated) { window.history.back(); }
    }

    selectSpeciality(value) {
        this.treatments = this.treatmentsAll.filter(x => x.CCatalog.Parent == value);
    }

}

