import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { DataTableDirectives } from 'angular2-datatable/datatable';
import { Response } from "../common/response/model/response";
import { DiagnosisPlanService } from "./services/diagnosis-plan.services";
import { PatientService } from "../patients/services/patients.services";
import { AppGlobals } from "../common/globals/globals";
import { Patient } from "../patients/model/patient";
import { Person } from "../profile/model/person";
import { Diagnosis_Plan } from "./model/diagnosis-plan";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { DiagnosisPlanFormComponent } from "./form/diagnosis-plan-form.component";
import { ConsultationFormComponent } from "../consultation/form/consultation-form.component";
import { ConsultationService } from "../consultation/services/consultation.services";
import { AppoitmentService } from "../calendar/services/appoiments.services";
import { Appoiment } from "../calendar/model/appoiment";
import { NotificationMessage } from "../common/notification/notification.services";
import { Consultation } from "../consultation/model/consultation";
import { EmployeesService } from "../employees/services/employees.services";
import * as _ from 'lodash';

@Component({
    selector: 'diagnosis-plan',
    templateUrl: './app/diagnosis-plan/diagnosis-plan.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives, DiagnosisPlanFormComponent, ConsultationFormComponent]
})
export class DiagnosisPlanComponent implements OnInit {

    sub: any;
    error: any;
    response: Response;
    responsePatient: Response;
    @Input() patientSelect: Patient;
    @Input() personSelect: Person;
    @Input() diagnosisPlan: Diagnosis_Plan;
    @Input() responseConsultation: Response;
    @Input() appoiment: Appoiment;
    @Input() consultation: Consultation;
    amountPending: number;
    pay: number;
    totalPayment: number = 0;
    totalAmount: number = 0;
    totalPending: number = 0;
    paymentMethods: any;
    allEmployees: Response;
    doctorExcecuteId: number = -1;

    public isRequesting: boolean = true;

    constructor(private router: Router, private route: ActivatedRoute, private diagnosisPlanService: DiagnosisPlanService, private patientService: PatientService,
        private appGlobals: AppGlobals, private consultationService: ConsultationService, private appoitmentService: AppoitmentService,
        private notification: NotificationMessage, private employeesService: EmployeesService) {
        this.response = new Response();
        this.diagnosisPlan = new Diagnosis_Plan();
    }

    getDiagnosisPlan(idPatient) {
        this.diagnosisPlanService
            .getDiagnosisPlansByPatient(idPatient)
            .then(response => {
                this.response = response;
                this.totalPayment = 0;
                this.totalAmount = 0;
                this.totalPending = 0;
                for (var i = 0; i < this.response.Data.length; i++) {
                    this.totalPayment = this.totalPayment + parseFloat(this.response.Data[i].Payment);
                    this.totalAmount = this.totalAmount + parseFloat(this.response.Data[i].TreatmentAmount);
                    this.totalPending = this.totalAmount - this.totalPayment;
                }
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    details(patient) {
        alert(patient.name);
    }

    execute(patient) {
        alert(patient.name);
    }

    ngOnInit() {
        this.paymentMethods = JSON.parse(localStorage.getItem('catalog')).Data.PAYMENTMETHODS;
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                let id = +params['id'];
                this.getDiagnosisPlan(id);
                this.patientSelect = new Patient();
                this.personSelect = new Person();
                this.patientService.getPatient(id)
                    .then(patient => {
                        this.responsePatient = patient;
                        this.patientSelect = this.responsePatient.Data;
                        this.personSelect = this.patientSelect.Person;
                        this.appGlobals.setPatient(this.patientSelect);
                    });
            }
        });
        this.appoiment = new Appoiment();
        this.appoiment.DateType = "month";
        this.getEmployees();
        this.doctorExcecuteId = JSON.parse(localStorage.getItem('user')).Data.Employees[0].Id;
    }

    goBack() {
        window.history.back();
    }

    selectTreatment(Id, TreatmentAmount, Payment) {
        this.diagnosisPlan.Id = Id;
        this.diagnosisPlan.TreatmentAmount = TreatmentAmount;
        this.diagnosisPlan.Payment = Payment;
        this.diagnosisPlan.PaymentMethodsId = -1;
        this.diagnosisPlan.Invoiced = false;
        this.amountPending = this.diagnosisPlan.TreatmentAmount - this.diagnosisPlan.Payment;
    }

    payment() {
        this.diagnosisPlan.Pay = this.diagnosisPlan.Pay == undefined ? 0 : this.diagnosisPlan.Pay;
        this.consultation = new Consultation();
        this.consultation.DoctorExecuteId = this.doctorExcecuteId;
        this.consultation.Diagnosis_PlanId = this.diagnosisPlan.Id;
        this.consultation.Payment = parseFloat(this.diagnosisPlan.Pay.toString());
        this.consultation.DiagnosisPlanStatus = this.diagnosisPlan.Status != undefined ? this.diagnosisPlan.Status : "FINISHED";
        this.consultation.Invoiced = this.diagnosisPlan.Invoiced;
        this.consultation.InvoicedNumber = this.diagnosisPlan.InvoicedNumber;
        if (this.diagnosisPlan.PaymentMethodsId != -1)
            this.consultation.PaymentMethodsId = this.diagnosisPlan.PaymentMethodsId;
        this.consultationService.save(this.consultation)
            .then(consultation => {
                $('#modalPayment').modal('hide');
                this.notification.notifySuccess("Pagar tratamiento");
                this.diagnosisPlan.Pay = 0;
                this.getDiagnosisPlan(this.appGlobals.patient.getValue().Id);
            });

    }

    delete(id) {
        this.diagnosisPlanService
            .delete(id)
            .then(response => {
                this.getDiagnosisPlan(this.patientSelect.Id)
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    close() {

    }

    goToOdontogram() {
        window.location.href = "#/odontogram/" + this.patientSelect.Id + "/" + this.personSelect.Age;
    }

    selectDiagnosisPlan(Id) {
        this.diagnosisPlan = new Diagnosis_Plan();
        this.diagnosisPlanService.getDiagnosisPlanById(Id)
            .then(diagnosisplan => {
                this.diagnosisPlan = diagnosisplan.Data;
                this.appGlobals.setDiagnosisPlan(this.diagnosisPlan);
            });
    }

    selectDiagnosisPlanConsultation(Id) {
        this.selectDiagnosisPlan(Id);
        this.getConsultationsByDiagnosticPlanId(Id);
    }

    getConsultationsByDiagnosticPlanId(Id) {
        this.consultationService.getConsultationsByDiagnosticPlanId(Id)
            .then(response => {
                this.responseConsultation = response;
                this.isRequesting = false;
            }).catch(error => this.error = error);
    }

    handleResponseUpdated(data) {
        this.response = data;
    }

    createNextAppoiment() {
        if (this.appoiment.CantDateType != null) {
            this.appoiment.Status = "SCHEDULED";
            this.appoiment.ClinicId = this.appGlobals.clinic.getValue().Id;
            this.appoiment.PatientId = this.patientSelect.Id;
            this.appoiment.ClassName = "bgm-red";
            this.appoitmentService.save(this.appoiment)
                .then(response => {
                    this.notification.notifySuccess("Guardar recordatorio de cita");
                })
                .catch(error => this.error = error);
        }
    }

    getEmployees() {
        var idCLinic = this.appGlobals.clinic.getValue().Id;
        this.employeesService
            .getEmployeesByClinic(idCLinic, 'DOCTOR')
            .then(response => {
                this.allEmployees = response.Data;
            })
            .catch(error => this.error = error);
    }

    getStatus(status) {
        switch (status) {
            case "PAID":
                return "PAGADO";
            case "ADVANCED":
                return "ADELANTADO";
            case "INPROCESS":
                return "EN PROCESO";
            case "PENDING":
                return "PENDIENTE";
            case "FINISHED":
                return "TERMINADO"
        }
    }

    setStatus(status) {
        this.diagnosisPlan.Status = status;
    }

    print() {
        let popupWinindow
        let innerContents = document.getElementById("treatmentsList");
        $('th', innerContents).remove('.actions');
        $('td', innerContents).remove('.actions');
        let header = '<h2>Plan diagn&oacute;stico y tratamientos a ejecutar.</h2>'
        let clinic = '<h3>Cl&iacute;nica: ' + this.appGlobals.clinic.getValue().Name + '</h3>'
        let doctor = '<h4>Atendido por: ' + this.appGlobals.userName.getValue() + '</h4>';
        popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + header + clinic + doctor + innerContents.innerHTML + '</html>');
        popupWinindow.document.close();
    }

}

