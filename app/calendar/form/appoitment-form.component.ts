import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppoitmentService } from "../services/appoiments.services";
import { Appoiment } from "../model/appoiment";
import { PatientService } from "../../patients/services/patients.services";
import { EmployeesService } from "../../employees/services/employees.services";
import { Response } from "../../common/response/model/response";
import { AppGlobals } from "../../common/globals/globals";
import { SpinnerComponent } from "../../common/spinner/spinner.component";
import { NotificationMessage } from "../../common/notification/notification.services";

@Component({
    selector: 'appoitment-form',
    templateUrl: './app/calendar/form/appoitment-form.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent]
})
export class AppoitmentFormComponent implements OnInit, AfterViewInit {
    title = 'Cita';
    sub_title = 'Agendar una  cita';
    sub_title_description = 'Define la fecha y la hora de una cita';


    @Input() appoitment: Appoiment;
    @Output() close = new EventEmitter();

    public isRequesting: boolean;
    navigated: boolean;
    sub: any;
    allPatients: Response;
    allEmployees: Response;
    response: Response;
    idPatient = -1;
    error: any;
    $: any;

    constructor(private router: Router, private appoitmentService: AppoitmentService, private route: ActivatedRoute,
        private patientService: PatientService, private appGlobals: AppGlobals, private employeesService: EmployeesService,
        private notification: NotificationMessage) {
    }

    ngOnInit() {
        this.initListener();
        this.getPatients();
        this.getEmployees();
        this.isRequesting = true;
        this.navigated = true;
        this.appoitment = new Appoiment();
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                let id = +params['id'];
                this.appoitmentService.getAppoitment(id)
                    .then(appoitment => {
                        this.response = appoitment;
                        this.appoitment = this.response.Data;
                        var datePipe = new DatePipe();
                        this.appoitment.Hour = this.appoitment.strHour;
                        this.appoitment.StartDate = datePipe.transform(this.appoitment.StartDate, 'dd/MM/yyyy');
                        localStorage.setItem("idPatient", this.appoitment.PatientId.toString());
                        this.setPatientName();
                        this.isRequesting = false;
                    });
            } else {
                this.appoitment = new Appoiment();
                this.appoitment.PatientId = -1;
                this.appoitment.EmployeeId = -1;
                this.appoitment.Duration = 30;
                this.appoitment.ClassName = "bgm-orange";
                this.isRequesting = false;
            }

            if (params['start'] != "!") {
                this.appoitment.StartDate = params['start'];
                this.appoitment.StartDate = this.appoitment.StartDate.replace("-", "/");
                this.appoitment.StartDate = this.appoitment.StartDate.replace("-", "/");
            }
        });
        let current_patient = localStorage.getItem("current_patient");

        if (current_patient != "" && current_patient != null) {
            this.appoitment.PatientId = JSON.parse(current_patient).Id;
            localStorage.removeItem("current_patient");
        }

        (function () {
            if ($('.selectpickers')[0]) {
                $('.selecstpicker').selectpicker();
            }
        })();

    }

    save() {
        this.isRequesting = true;
        this.appoitment.strStartDate = $('#StartDate').val();
        this.appoitment.strHour = $('#EndDate').val();
        this.appoitment.ClinicId = this.appGlobals.clinic.getValue().Id;
        this.appoitment.PatientId = this.appoitment.PatientId == -1 ? parseInt(localStorage.getItem("idPatient")) : this.appoitment.PatientId;

        switch (this.appoitment.ClassName) {
            case "bgm-red":
                this.appoitment.Status = "PLANNED";
                break;
            case "bgm-orange":
                this.appoitment.Status = "SCHEDULED";
                break;
            case "bgm-green":
                this.appoitment.Status = "CONFIRMED";
                break;
            case "bgm-black":
                this.appoitment.Status = "CANCELLED";
                break;
            case "bgm-gray":
                this.appoitment.Status = "NOTASSIST";
                break;
                
            default: {
                this.appoitment.ClassName = "bgm-orange";
                this.appoitment.Status = "SCHEDULED";
            }
                break;
        }

        this.appoitmentService.save(this.appoitment)
            .then(appoitment => {
                this.isRequesting = false;
                this.notification.notifySuccess("Guardar cita");
                window.history.back();
            });
    }


    getPatients() {
        var idCLinic = this.appGlobals.clinic.getValue().Id;

        var idEmployee = -1;
        if (this.appGlobals.owner.getValue() === false && (JSON.parse(localStorage.getItem('user')).Data.Clinics.length == 0 || JSON.parse(localStorage.getItem('user')).Data.Clinics[0].Active))
            idEmployee = JSON.parse(localStorage.getItem('user')).Data.Employees[0].Id;

        this.patientService
            .getByIdClinicByIdEmployee(idCLinic, idEmployee, "!", "!", "!")
            .then(response => {
                this.allPatients = response.Data;
                this.setPatientName();
            })
            .catch(error => this.error = error);
    }

    setPatientName() {
        if (this.allPatients != undefined && this.allPatients.length > 0) {
            for (var item of this.allPatients) {
                if (item.patient.Id == this.appoitment.PatientId)
                    this.appoitment.PatientName = item.LastNames + " " + item.Name;
            }
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

    cancel(savedAppoiment: Appoiment = null) {
        this.close.emit(savedAppoiment);
        window.history.back();
    }

    goBack(savedAppoiment: Appoiment = null) {
        this.close.emit(savedAppoiment);
        if (this.navigated) { window.history.back(); }
    }

    selectTagColor(color) {
        this.appoitment.ClassName = color;
    }

    ngAfterViewInit() {
        $('.date-time-picker').datetimepicker();
        $('.time-picker').datetimepicker({ format: 'LT' });
        $('.date-picker').datetimepicker({ format: 'DD/MM/YYYY' });

        this.loadData(this.appoitment.PatientId);
    }

    selectOption(id) {
        alert(id);
        console.log(1);
    }

    initListener() {
        localStorage.setItem("idPatient", "-1");
        (function () {
            $("#patientId").bind('input', function () {
                var inputValue = $('#patientId').val();
                var x = document.getElementById("text_editors");
                var i;
                for (i = 0; i < x.options.length; i++) {
                    if (inputValue == x.options[i].value) {
                        localStorage.setItem("idPatient", x.options[i].getAttribute('id'));
                    }
                }
            });
        })();
    }

    loadData(PatientId) {
        (function () {
            var x = document.getElementById("text_editors");
            var i;
            for (i = 0; i < x.options.length; i++) {
                if (PatientId == parseInt(x.options[i].getAttribute('id'))) {
                    $('#patientId').val(x.options[i].value);
                }
            }
        })();
    }

    delete() {
        this.isRequesting = true;
        this.appoitmentService.delete(this.appoitment)
            .then(appoitment => {
                this.notification.notifySuccess("Cita eliminada");
                this.isRequesting = false;
                window.history.back();
            });
    }

}

