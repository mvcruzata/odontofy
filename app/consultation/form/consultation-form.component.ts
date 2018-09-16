import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Consultation } from "../model/consultation";
import { ConsultationService } from "../services/consultation.services";
import { TreatmentService } from "../../treatments/services/treatments.services";
import { Treatment } from "../../treatments/model/treatment";
import { AppGlobals } from "../../common/globals/globals";
import { DataTableDirectives } from 'angular2-datatable/datatable';
import { Response } from "../../common/response/model/response";
import { Patient } from "../../patients/model/patient";
import { Person } from "../../profile/model/person";
import { Diagnosis_Plan } from "../../diagnosis-plan/model/diagnosis-plan";
import { SpinnerComponent } from "../../common/spinner/spinner.component";
import { NotificationMessage } from "../../common/notification/notification.services";

@Component({
    selector: 'consultation-form',
    templateUrl: './app/consultation/form/consultation-form.html',
    directives: [ROUTER_DIRECTIVES, DataTableDirectives, SpinnerComponent]
})
export class ConsultationFormComponent implements OnInit {

    @Input() consultation: Consultation;
    @Output() close = new EventEmitter();
    navigated = false;
    sub: any;
    treatments: Treatment[];
    public id: number;
    discount: number;
    price: number;
    consultations = [];
    tab1: string = "";
    tab2: string = "";

    public isRequesting: boolean;
    error: any;
    @Input() diagnosisPlan: Diagnosis_Plan;
    @Input() response: Response;

    constructor(private router: Router, private route: ActivatedRoute, private appGlobals: AppGlobals,
        private consultationService: ConsultationService, private treatmentService: TreatmentService, private notification: NotificationMessage) {
        this.response = new Response();
    }

    ngOnInit() {
        var idClinic = this.appGlobals.clinic.getValue().Id;
        this.response = new Response();
        this.consultation = new Consultation();
    }

    save() {
        this.isRequesting = true;
        this.consultation.DoctorExecuteId = JSON.parse(localStorage.getItem('user')).Data.Employees[0].Id;
        this.consultation.Diagnosis_PlanId = this.diagnosisPlan.Id;
        this.consultationService.save(this.consultation)
            .then(consultation => {
                this.notification.notifySuccess("Guardar consulta");
                this.getConsultationsByDiagnosticPlanId();
                this.consultation = new Consultation();
                this.isRequesting = false;
            });
    }

    getConsultationsByDiagnosticPlanId() {
        this.consultationService.getConsultationsByDiagnosticPlanId(this.diagnosisPlan.Id)
            .then(response => {
                this.response = response;
                this.isRequesting = false;
            }).catch(error => this.error = error);
    }

    goBack(consultation: Consultation = null) {
        this.close.emit(consultation);
        if (this.navigated) { window.history.back(); }
    }

    cancel() {
        if (this.navigated) { window.history.back(); }
    }

    updateConsultation(item) {
        this.consultation = item;
        this.tab1 = "active";
        document.getElementById("tab2").classList.remove("active");
    }
    
    selectTab() {
        this.tab1 = "";
    }

}
