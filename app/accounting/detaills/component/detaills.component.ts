import { Component, EventEmitter, Input, OnInit, OnDestroy, Output} from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute }  from '@angular/router';
import {AccountingService} from "../../services/accounting.services";
import {LocalStorage, SessionStorage} from "angular2-localstorage/WebStorage";
import {DataTableDirectives} from 'angular2-datatable/datatable';
import {Response} from "../../../common/response/model/response";
import {SpinnerComponent} from "../../../common/spinner/spinner.component";

@Component({
    selector: 'accounting-detaills-component',
    templateUrl: './app/accounting/detaills/component/detaills.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives]
})
export class AccountingDetaillsGeneralComponent implements OnInit, OnDestroy {

    @Output() close = new EventEmitter();
    title = 'Detalles';
    sub_title = 'Detalles de pagos';
    sub_title_description = 'Detalles de pagos';
    navigated = false; // true if navigated here
    sub: any;
    public cat: any;
    response: Response;
    error: any;

    constructor(private accountingService: AccountingService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                let id = +params['id'];
                let status = params['status'];
                this.navigated = true;
                this.response = new Response();
                this.accountingService
                    .getAccountingByPatient(id, status)
                    .then(response => {
                        this.response = response;
                    })
                    .catch(error => this.error = error);
            } else {
                this.navigated = false;
                this.response = new Response();
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    goBack(savedPatient: Patient = null) {
        this.close.emit(savedPatient);
        if (this.navigated) { window.history.back(); }
    }

}

