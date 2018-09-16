import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Employee } from "../model/employee";
import { EmployeesService } from "../services/employees.services";
import { ProfileService } from "../../profile/services/profile.services";
import { LoginService } from "../../login/services/login.services";
import { Response } from "../../common/response/model/response";
import { AppGlobals } from "../../common/globals/globals";
import { SpinnerComponent } from "../../common/spinner/spinner.component";
import { User } from "../../login/model/user";
import { NotificationMessage } from "../../common/notification/notification.services";

@Component({
    selector: 'employees-form',
    templateUrl: './app/employees/form/employees-form.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent]
})
export class EmployeesFormComponent implements OnInit {
    title = 'Empleado';
    sub_title = 'Asociar empleado';
    sub_title_description = 'Configurar el rol del empleado';

    @Input() employee: Employee;
    @Input() user: User;
    @Output() close = new EventEmitter();
    error: any;
    navigated = false;
    sub: any;
    public isRequesting: boolean;
    public newPerson: boolean = false;

    private jobs: any;
    allEmployees: Response;

    constructor(private employeesService: EmployeesService,
        private route: ActivatedRoute, private profileService: ProfileService,
        private appGlobals: AppGlobals, private loginService: LoginService, private notification: NotificationMessage) {
    }

    ngOnInit() {
        this.jobs = JSON.parse(localStorage.getItem('catalog')).Data.JOBSTYPES;
        this.getEmployees();
        this.navigated = true;
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                let id = +params['id'];
                this.employee = new Employee();
                this.employeesService.getEmployee(id)
                    .then(employee => {
                        this.employee = employee.Data
                    });
                this.user = new User();
            } else {
                this.employee = new Employee();
                this.employee.EmployeeId = -1;
                this.employee.JobId = -1;
                this.user = new User();
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    save() {
        this.isRequesting = true;

        if (this.user != undefined && this.user.Name != undefined && this.user.Name != "")
            this.register();
        else
            this.saveEmployee();
    }

    saveEmployee() {
        this.employee.ClinicId = this.appGlobals.clinic.getValue().Id;
        this.employee.Active = true;
        this.employeesService.asociate(this.employee)
            .then(employee => {
                this.isRequesting = false;
                this.notification.notifySuccess("Guardar empleado");
                window.history.back();
            });
    }

    cancel(savedEmployee: Employee = null) {
        this.close.emit(savedEmployee);
        if (this.navigated) { window.history.back(); }
    }
    goBack(savedEmployee: Employee = null) {
        this.close.emit(savedEmployee);
        if (this.navigated) { window.history.back(); }
    }

    getEmployees() {
        this.employeesService
            .getEmployees()
            .then(response => {
                this.allEmployees = response.Data;
            })
            .catch(error => this.error = error);
    }

    addPerson() {
        this.newPerson = true;
    }
    
    register() {
        this.user.ConfirmPassword = this.user.Password;
        this.user.IHaveClinic = false;
        this.user.ImProfesional = true;
        this.user.LicenseAgreement = true;
        this.user.PaymentPlanId = -1;
        this.user.ClinicSpecialtyId = -1;
        this.loginService
            .register(this.user)
            .then(response => {
                if (response.Code != "ERROR") {
                    this.user.Id = response.Data.Id;
                    this.loadEmploye();
                }
                else
                    window.history.back();
            })
            .catch(error => {
                this.error = error;
            });
    }

    loadEmploye() {
        this.employeesService
            .getEmployeeByGetByUserId(this.user.Id)
            .then(response => {
                this.employee.EmployeeId = response.Data.employee.Id;
                this.saveEmployee(); 
            })
            .catch(error => this.error = error);
    }

}


