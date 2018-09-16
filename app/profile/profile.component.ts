import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CloudService } from "../common/services/cloud.services";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { Response } from "../common/response/model/response";
import { ProfileService } from "./services/profile.services";
import { ClinicService } from "../clinic/services/clinic.services";
import { EmployeesService } from "../employees/services/employees.services";
import { Person } from "./model/person";
import { Clinic } from "../clinic/model/clinic";
import { Employee } from "../employees/model/employee";
import { AppGlobals } from "../common/globals/globals";
import { EmailValidator } from "../common/directives/email.directives";
import { ChangePassword } from "../login/model/changePassword";
import { LoginService } from "../login/services/login.services";
import { NotificationMessage } from "../common/notification/notification.services";

@Component({
    selector: 'profile',
    templateUrl: './app/profile/profile.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, EmailValidator]
})
export class ProfileComponent implements OnInit, AfterViewInit {
    title = 'Perfil';
    subtitle = 'Información del perfil  ';
    description_subtitle = 'Complete toda la información para el uso posterior de la plataforma';

    @Input() person: Person;
    @Input() clinic: Clinic;
    @Input() changePass: ChangePassword;
    @Output() close = new EventEmitter();
    error: any;
    response: Response;
    catalogs: Array<any>;
    paymentsTypes: Array<any>;
    catalogsSpecialty: Array<any>;

    public isRequesting: boolean = true;
    public clinicType: string;

    constructor(private profileService: ProfileService, private clinicService: ClinicService, private employeesService: EmployeesService,
        private appGlobals: AppGlobals, private loginService: LoginService, private notification: NotificationMessage) {
        this.response = new Response();
    }

    getProfile() {
        this.person = JSON.parse(localStorage.getItem('user')).Data;
        this.person.SpecialtyId = JSON.parse(localStorage.getItem('user')).Data.Employees[0].SpecialtyId;

        var datePipe = new DatePipe();
        this.person.DateOfBirth = datePipe.transform(this.person.DateOfBirth, 'dd/MM/yyyy');
        if (JSON.parse(localStorage.getItem('user')).Data.Clinics[0] != undefined) {
            this.clinic = JSON.parse(localStorage.getItem('user')).Data.Clinics[0];
            if (this.clinic.PaymentPlanId == null || this.clinic.PaymentPlanId == undefined)
                this.clinic.PaymentPlanId = -1;

            if (this.clinic.Clinic_Specialties.length > 0 && this.clinic.Clinic_Specialties[0].SpecialtiesId != null && this.clinic.Clinic_Specialties[0].SpecialtiesId != undefined) {
                this.clinic.SpecialtyId = this.clinic.Clinic_Specialties[0].SpecialtiesId;
            }
            else
                this.clinic.SpecialtyId = -1;

            this.clinic.Banck = -1;
        }
        this.isRequesting = false;
    }

    editProfile() {
        this.isRequesting = true;
        this.person.DateOfBirth = $('.date-picker').val();
        this.person.strDateOfBirth = $('.date-picker').val();

        this.profileService.save(this.person)
            .then(person => {
                this.loadProfile();
                this.notification.notifySuccess("Guardar perfil");
            });
    }


    editCLinic() {
        this.isRequesting = true;
        this.clinicService.save(this.clinic)
            .then(clinic => {
                this.loadProfile();
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
        this.catalogsSpecialty = JSON.parse(localStorage.getItem('catalog')).Data.CLINICTYPES;
    }

    cancel(savedPerson: Person = null, savedClinic: Clinic = null) {
        this.close.emit(savedPerson);
        this.close.emit(savedClinic);
        window.history.back();
    }

    changePassword() {
        this.isRequesting = true;
        this.loginService.changePassword(this.changePass)
            .then(response => {
                if (response.Code != 'ERROR') {
                    this.notification.notifySuccess("Cambiar contrase&ntilde;a");
                    window.history.back();
                }
                else {
                    this.error = true;
                    this.response.Message = response.Message;
                }
            });
    }

    ngOnInit() {
        this.person = new Person();
        this.clinic = new Clinic();
        this.changePass = new ChangePassword();
        this.getProfile();
        this.getCatalogs();
    }

    activeClinic() {
        this.clinic.Active = true;
    }

    ngAfterViewInit() {
        $('.date-time-picker').datetimepicker();
        $('.time-picker').datetimepicker({ format: 'LT' });
        $('.date-picker').datetimepicker({ format: 'DD/MM/YYYY' });
    }
    
}

