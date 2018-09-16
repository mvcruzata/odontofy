import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute }     from '@angular/router';
import {DataTableDirectives} from 'angular2-datatable/datatable';
import {Response} from "../common/response/model/response";
import {SpinnerComponent} from "../common/spinner/spinner.component";
import * as _ from 'lodash';
import {AccountingService} from "./services/accounting.services";
import {AppGlobals} from "../common/globals/globals";

@Component({
    selector: 'accounts-receivable',
    templateUrl: './app/accounting/accounting.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives]
})
export class AccountingComponent implements OnInit, AfterViewInit {

    sub: any;
    error: any;
    response: Response;
    totalPayment: number = 0;
    totalAmount: number = 0;
    totalOwed: number = 0;
    public isRequesting: boolean = true;
    subtitle = "Estado de cuentas";

    constructor(private accountingService: AccountingService, private route: ActivatedRoute,
        private appGlobals: AppGlobals) {

    }

    getAccountingByClinic(status) {
        this.isRequesting = true;
        var start = $('#dateStart').val() == "" ? "!" : $('#dateStart').val();
        var end = $('#dateEnd').val() == "" ? "!" : $('#dateEnd').val();
        var query = $('#query').val() == "" ? "!" : $('#query').val();
        start = start.replace("/", "-");
        start = start.replace("/", "-");
        end = end.replace("/", "-");
        end = end.replace("/", "-");

        this.response = new Response();
        this.accountingService
            .getAccountingByClinic(this.appGlobals.clinic.getValue().Id, status, start, end, query)
            .then(response => {
                this.response = response;
                this.totalPayment = 0;
                this.totalAmount = 0;
                this.Owed = 0;
                for (var i = 0; i < this.response.Data.length; i++) {
                    this.totalPayment = this.totalPayment + parseFloat(this.response.Data[i].Payment);
                    this.totalAmount = this.totalAmount + parseFloat(this.response.Data[i].TreatmentAmount);
                    this.totalOwed = this.totalOwed + parseFloat(this.response.Data[i].Owed);
                }

                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if (params['status']) {
                let status = params['status'];
                this.getAccountingByClinic(status);
            }
        });
    }

    ngAfterViewInit() {
        $('.date-time-picker').datetimepicker();
        $('.time-picker').datetimepicker({ format: 'LT' });
        $('.date-picker').datetimepicker({ format: 'DD/MM/YYYY' });
    } 
}
