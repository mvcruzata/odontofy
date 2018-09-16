import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { RuntimeCompiler } from '@angular/compiler';

import './rxjs-extensions';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { OdontogramComponent } from "./odontogram/odontogram.component";
import { OdontogramService } from "./odontogram/services/odontogram.services";
import { CalendarComponent } from "./calendar/calendar.component";
import { DataPersonalComponent } from "./patients/data-personal/data-personal.component";
import { AppoitmentFormComponent } from "./calendar/form/appoitment-form.component";
import { PatiensFormComponent } from "./patients/data-personal/form/patiens-form.component";
import { DiagnosisPlanComponent } from "./diagnosis-plan/diagnosis-plan.component";
import { DiagnosisPlanFormComponent } from "./diagnosis-plan/form/diagnosis-plan-form.component";
import { HistoriesComponent } from "./patients/histories/histories.component";
import { AccountingComponent } from "./accounting/accounting.component";
import { AccountingDetaillsComponent } from "./accounting/detaills/detaills.component";
import { AccountingDetaillsGeneralComponent } from "./accounting/detaills/component/detaills.component";
import { TreatmentsComponent } from "./treatments/treatments.component";
import { TreatmentsFormComponent } from "./treatments/form/treatments-form.component";
import { EmployeesComponent } from "./employees/employees.component";
import { EmployeesFormComponent } from "./employees/form/employees-form.component";
import { TreatmentService } from "./treatments/services/treatments.services";
import { CloudService } from "./common/services/cloud.services";
import { DashBoardService } from "./dashboard/services/dashboard.services";
import { CatalogsService } from "./common/catalogs/services/catalogs.services";
import { Response } from "./common/response/model/response";
import { ProfileComponent } from './profile/profile.component';
import { EmployeesService } from "./employees/services/employees.services";
import { PatientService } from "./patients/services/patients.services";
import { AccountingService } from "./accounting/services/accounting.services";
import { ProfileService } from "./profile/services/profile.services";
import { LocalStorageService } from "angular2-localstorage/LocalStorageEmitter";
import { LocalStorage, SessionStorage } from "angular2-localstorage/WebStorage";
import { LoginComponent } from "./login/login.component";
import { AppGlobals } from "./common/globals/globals";
import { AppoitmentService } from './calendar/services/appoiments.services';
import { DiagnosisPlanService } from "./diagnosis-plan/services/diagnosis-plan.services";
import { LoginService } from "./login/services/login.services";
import { PatiensViewComponent } from "./patients/data-personal/view/patiens-view.component";
import { SpinnerComponent } from "./common/spinner/spinner.component";
import { ClinicService } from "./clinic/services/clinic.services";
import { ConsultationComponent } from "./consultation/consultation.component";
import { ConsultationFormComponent } from "./consultation/form/consultation-form.component";
import { ConsultationService } from "./consultation/services/consultation.services";
import { NotificationComponent } from "./notification/notification.component";
import { NotificationService } from "./notification/services/notification.services";
import { EmailValidator } from "./common/directives/email.directives";
import { ChartsComponent } from "./reports/charts.component";
import { PatientDashBoardComponent } from "./patients/dashboard/dashboard.component";
import { FileService } from "./files/services/files.services";
import { FileUploaderComponent } from "./files/file.component";
import { ReferralsService } from "./referrals/services/referrals.services";
import { NotificationMessage } from "./common/notification/notification.services";
import { ClinicComponent } from "./clinic/clinic.component";
import { ReportService } from "./reports/services/reports.services";
import { BillingComponent } from "./billing/billing.component";
import { BillingService } from "./billing/services/billing.services";


@Component({
    selector: 'my-app',
    templateUrl: "./app/template/template.html",
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES, LoginComponent, SpinnerComponent, EmailValidator],
    precompile: [DashboardComponent, OdontogramComponent, CalendarComponent, AppoitmentFormComponent, DataPersonalComponent,
        PatiensFormComponent, DiagnosisPlanComponent, DiagnosisPlanFormComponent, HistoriesComponent,
        AccountingComponent, TreatmentsComponent, TreatmentsFormComponent, EmployeesComponent, EmployeesFormComponent,
        PatiensViewComponent, ProfileComponent, LoginComponent, AccountingDetaillsComponent, PatiensViewComponent,
        ConsultationComponent, ConsultationFormComponent, NotificationComponent, ChartsComponent, PatientDashBoardComponent,
        AccountingDetaillsGeneralComponent, FileUploaderComponent, ClinicComponent, BillingComponent],
    providers: [
        HTTP_PROVIDERS, TreatmentService, CloudService, DashBoardService, CatalogsService, EmployeesService, PatientService,
        AccountingService, LocalStorageService, AppGlobals, ProfileService, AppoitmentService, DiagnosisPlanService, LoginService,
        ClinicService, OdontogramService, ConsultationService, NotificationService, FileService, ReferralsService, NotificationMessage,
        ReportService, BillingService
    ]
})
export class AppComponent implements OnInit {
    title = 'Dashboard';
    response: Response;
    error: any;
    isRequesting: boolean;
    sub: any;

    @LocalStorage("catalog") public catalog: any;

    constructor(private catalogsService: CatalogsService, private appGlobals: AppGlobals, private profileService: ProfileService,
        private route: ActivatedRoute, private _runtimeCompiler: RuntimeCompiler) {
        this.response = new Response();
        document.getElementById("index-spinner").style.display = "none";
    }

    ngOnInit() {
        this.isRequesting = true;

        if (localStorage.getItem("token") != null && localStorage.getItem("token") != "") {
            this.appGlobals.setLoginStatus(true);
            this.loadProfile();
            this.getCatalogs();
        }
        else
            this.appGlobals.setLoginStatus(false);

    }

    getCatalogs() {
        this.catalogsService
            .getCatalogs()
            .then(response => {
                localStorage.setItem("catalog", JSON.stringify(response));
                this.response = response;
                this.isRequesting = false;
            })
            .catch(error => {
                this.error = error;
                this.isRequesting = false;
            });
    }

    loadProfile() {
        this.profileService
            .getProfilebyUserId(JSON.parse(localStorage.getItem("token")).Id)
            .then(response => {
                localStorage.setItem("user", JSON.stringify(response));
                this.response = response;
                this.appGlobals.setUserName(response.Data.Name + " " + response.Data.LastNames);
                this.isRequesting = false;
            })
            .catch(error => {
                this.error = error;
                this.isRequesting = false;
            });
    }

    logout() {
        this.appGlobals.setLoginStatus(false);
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
        localStorage.setItem("current_patient", "");
        localStorage.setItem("events", "");
        localStorage.setItem("ma-layout-status", "0");
        localStorage.setItem("catalog", "");
    }

    clearCache() {
        this.appGlobals.setIsRequestingGlobal(true);
        this.catalogsService
            .getCatalogs()
            .then(response => {
                this.response = response;
                var token = localStorage.getItem("token");
                this._runtimeCompiler.clearCache();
                localStorage.setItem("version", this.response.Version);
                localStorage.setItem("token", token);
                localStorage.setItem("catalog", JSON.stringify(this.response));
                this.appGlobals.setIsRequestingGlobal(false);
            })
            .catch(error => {
                this.error = error;
                this.isRequesting = false;
            });
    }
}
