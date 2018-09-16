import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CloudService } from "../common/services/cloud.services";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { Response } from "../common/response/model/response";
import { ProfileService } from "../profile/services/profile.services";
import { ClinicService } from "../clinic/services/clinic.services";
import { EmployeesService } from "../employees/services/employees.services";
import { Person } from "../profile/model/person";
import { Clinic } from "../clinic/model/clinic";
import { Employee } from "../employees/model/employee";
import { AppGlobals } from "../common/globals/globals";
import { EmailValidator } from "../common/directives/email.directives";
import { LoginService } from "../login/services/login.services";
import { NotificationMessage } from "../common/notification/notification.services";

@Component({
    selector: 'profile',
    templateUrl: './app/clinic/clinic.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, EmailValidator]
})
export class ClinicComponent implements OnInit, AfterViewInit {
    title = 'Perfil';
    subtitle = 'Información del perfil  ';
    description_subtitle = 'Complete toda la información para el uso posterior de la plataforma';

    @Input() person: Person;
    @Input() clinic: Clinic;
    @Output() close = new EventEmitter();
    error: any;
    response: Response;
    catalogs: Array<any>;
    paymentsTypes: Array<any>;
    catalogsSpecialty: Array<any>;

    public isRequesting: boolean = true;
    public clinicType: string;
    isSuperAdmin: boolean = false;

    constructor(private profileService: ProfileService, private clinicService: ClinicService, private employeesService: EmployeesService,
        private appGlobals: AppGlobals, private loginService: LoginService, private notification: NotificationMessage) {
        this.response = new Response();
        this.clinic = new Clinic();
    }

    ngOnInit() {
        this.clinic = new Clinic();
        this.getClinic();
    }

    getClinic() {
        var user = JSON.parse(localStorage.getItem('user')).Data;
        this.isSuperAdmin = user.Id == 3;
        var idCLinic = this.appGlobals.clinic.getValue().Id;
        this.clinicService.getClinicById(idCLinic)
            .then(response => {
                this.response = response;
                this.clinic = this.response.Data;

                if (this.clinic.PaymentPlanId == null || this.clinic.PaymentPlanId == undefined)
                    this.clinic.PaymentPlanId = -1;

                if (this.clinic.Clinic_Specialties.length > 0 && this.clinic.Clinic_Specialties[this.clinic.Clinic_Specialties.length - 1].SpecialtiesId != null && this.clinic.Clinic_Specialties[this.clinic.Clinic_Specialties.length - 1].SpecialtiesId != undefined) {
                    this.clinic.SpecialtyId = this.clinic.Clinic_Specialties[this.clinic.Clinic_Specialties.length - 1].SpecialtiesId;
                }
                else
                    this.clinic.SpecialtyId = -1;

                this.clinic.Banck = -1;
                this.getCatalogs();
            });
    }

    editCLinic(load) {
        if (load)
            this.isRequesting = true;
        this.clinicService.save(this.clinic)
            .then(clinic => {
                this.isRequesting = false;
                this.notification.notifySuccess("Guardar cl&iacute;nica");
            });
    }

    loadProfile() {
        let idUser = JSON.parse(localStorage.getItem("user")).Data.AspNetUser.Id;
        this.profileService
            .getProfilebyUserId(idUser)
            .then(response => {
                localStorage.setItem("user", JSON.stringify(response));
                this.appGlobals.setUserName(response.Data.Name + " " + response.Data.LastNames);
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    getCatalogs() {
        this.catalogs = JSON.parse(localStorage.getItem('catalog')).Data.JOBSTYPES;
        this.paymentsTypes = JSON.parse(localStorage.getItem('catalog')).Data.PAYMENTPLAN;
        this.formatPaymentsTypes(this.clinic.PaymentPlanId);
        this.catalogsSpecialty = JSON.parse(localStorage.getItem('catalog')).Data.CLINICTYPES;
        this.isRequesting = false;
    }

    cancel(savedPerson: Person = null, savedClinic: Clinic = null) {
        this.close.emit(savedPerson);
        this.close.emit(savedClinic);
        window.history.back();
    }

    activeClinic() {
        this.clinic.Active = true;
        this.editCLinic(false);
    }

    selectPlan(plan) {
        this.formatPaymentsTypes(plan.Id);
        this.clinic.PaymentPlanId = plan.Id;
        this.clinic.Active = true;
        this.editCLinic(false);
    }

    cancelMembership() {
        this.clinic.PaymentPlanId = -2;
        this.clinic.Active = false;
        this.editCLinic(false);
    }

    getValue(text, position) {
        var elements = text.split(",");
        return elements[position];
    }

    getFeatures(text) {
        var elements = text.split(",");
        return elements.slice(4, elements.length);
    }

    formatPaymentsTypes(planId) {
        for (var item of this.paymentsTypes) {
            item.Value = planId == item.Id;
            item.Class = planId == item.Id ? 'select-plan' : '';
            item.Show = item.Id == "154" ? (this.clinic.PaymentPlanId == 154 || this.isSuperAdmin) : true;
        }
    }

    ngAfterViewInit() {
        $('.date-time-picker').datetimepicker();
        $('.time-picker').datetimepicker({ format: 'LT' });
        $('.date-picker').datetimepicker({ format: 'DD/MM/YYYY' });
    }

}

