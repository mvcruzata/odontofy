import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataTableDirectives } from 'angular2-datatable/datatable';
import { Response } from "../common/response/model/response";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import * as _ from 'lodash';
import { BillingService } from "./services/billing.services";
import { AppGlobals } from "../common/globals/globals";
import { ClinicService } from "../clinic/services/clinic.services";
import { Clinic } from "../clinic/model/clinic";


@Component({
    selector: 'accounts-receivable',
    templateUrl: './app/billing/billing.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives]
})
export class BillingComponent implements OnInit {

    sub: any;
    error: any;
    response: Response;
    responsePlan: Response;
    responsePartnetship: Response;
    responseProfesional: Response;
    responseBilling: Response;
    public isRequesting: boolean = true;
    subtitle = "Facturas";
    public clinic: Clinic;
    public paymentsTypes: any;
    plan: any;
    namePlan = "";
    amountPlan = 0;
    amountPartnership = 0;
    amountProfesional = 0;
    feePartner = 0;
    partner = false;
    paymentDate: any = "";
    countPaidPending = 0;
    years: Array<number> = [];
    months: Array<any> = [{ id: 1, name: "Enero" }, { id: 2, name: "Febrero" }, { id: 3, name: "Marzo" }, { id: 4, name: "Abril" }, { id: 5, name: "Mayo" }, { id: 6, name: "Junio" }, { id: 7, name: "Julio" }, { id: 8, name: "Agosto" }, { id: 9, name: "Septiembre" }, { id: 10, name: "Octubre" }, { id: 11, name: "Noviembre" }, { id: 12, name: "Diciembre" }]
    year: number = new Date().getYear() + 1900;
    month: number = new Date().getMonth() + 1;

    constructor(private billingService: BillingService, private route: ActivatedRoute,
        private appGlobals: AppGlobals, private clinicService: ClinicService) {

    }

    ngOnInit() {
        this.response = new Response();
        this.responsePlan = new Response();
        this.responsePartnetship = new Response();
        this.responseProfesional = new Response();
        this.responseBilling = new Response();
        this.paymentsTypes = JSON.parse(localStorage.getItem('catalog')).Data.PAYMENTPLAN;
        this.clinic = new Clinic();
        this.getClinic();
        this.getYears();
        this.getData();
        //this.getBillingMyMonth();
    }

    getData() {
        this.getClinic();
        this.getPaymentsByClinicByEmploye();
        this.getBillingByClinic();
    }

    getBillingByClinic() {
        this.countPaidPending = 0;
        this.billingService
            .getBillingByClinic(this.appGlobals.clinic.getValue().Id)
            .then(response => {
                this.responseBilling = response;
                for (var i = 0; i < this.responseBilling.Data.length; i++) {
                    var datePipe = new DatePipe();
                    this.paymentDate = datePipe.transform(this.responseBilling.Data[i].EndDate, 'dd/MM/yyyy');
                    this.countPaidPending++; 
                }
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    getBillingMyMonth() {
        this.billingService
            .getBillingMyMonth(this.appGlobals.clinic.getValue().Id)
            .then(response => {
                this.response = response;
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    getClinic() {
        var idCLinic = this.appGlobals.clinic.getValue().Id;
        this.clinicService.getClinicById(idCLinic)
            .then(response => {
                this.responsePlan = response;
                this.clinic = this.responsePlan.Data;

                if (this.clinic.PaymentPlanId == null || this.clinic.PaymentPlanId == undefined)
                    this.clinic.PaymentPlanId = -1;

                this.plan = this.paymentsTypes.filter(x => x.Id == this.clinic.PaymentPlanId)[0];
                this.namePlan = this.getValue(this.plan.Description, 0)
                this.amountPlan = this.getValue(this.plan.Description, 1);
                this.feePartner = this.getValue(this.plan.Description, 3);
                
                if (this.plan.Name == "PARTNERS") {
                    this.partner = true;
                    this.getByPatientPartnetship();
                }
                this.isRequesting = false;
            });
    }

    getByPatientPartnetship() {
        this.billingService
            .getByPatientPartnetship(this.appGlobals.clinic.getValue().Id, this.month, this.year)
            .then(response => {
                this.amountPartnership = 0;
                this.responsePartnetship = response;
                for (var i = 0; i < this.responsePartnetship.Data.length; i++) {
                    this.amountPartnership = this.amountPartnership + (parseFloat(this.responsePartnetship.Data[i].Payment) * this.feePartner / 100);
                }
            })
            .catch(error => {
                this.error = error
            });
    }

    getPaymentsByClinicByEmploye() {
        this.amountProfesional = 0;
        this.billingService
            .getPaymentsByClinicByEmploye(this.appGlobals.clinic.getValue().Id, this.month, this.year)
            .then(response => {
                this.responseProfesional = response;
                for (var i = 0; i < this.responseProfesional.Data.length; i++) {
                    this.amountProfesional = this.amountProfesional + (parseFloat(this.responseProfesional.Data[i].Payment) * 50 / 100);
                }
            })
            .catch(error => {
                this.error = error
            });
    }

    getValue(text, position) {
        var elements = text.split(",");
        return elements[position];
    }

    getYears() {
        let currentYear = new Date().getYear();
        do {
            this.years.push(currentYear + 1900);
            currentYear--;
        }
        while (currentYear >= 118)
    }

}
