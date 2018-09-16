import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Odontogram } from './model/odontogram';
import { OdontogramService } from './services/odontogram.services';
import { PatientService } from "../patients/services/patients.services";
import { Response } from '../common/response/model/response';
import { AppGlobals } from "../common/globals/globals";
import { Patient } from "../patients/model/patient";
import { Person } from "../profile/model/person";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { DiagnosisPlanService } from "../diagnosis-plan/services/diagnosis-plan.services";
import { Diagnosis_Plan } from "../diagnosis-plan/model/diagnosis-plan";
import { TreatmentService } from "../treatments/services/treatments.services";

@Component({
    selector: 'odontogram',
    templateUrl: './app/odontogram/odontogram.html',
    styleUrls: ['./app/odontogram/odontogram.css'],
    directives: [ROUTER_DIRECTIVES, SpinnerComponent]
})
export class OdontogramComponent implements OnInit {
    title = 'Odontograma';
    subtitle = 'Odontograma de';
    description_subtitle = '';

    @Input() odontogram: Odontogram;
    @Output() closeE = new EventEmitter();

    public isRequesting: boolean = true;
    public legend: string;
    sub: any;
    error: any;
    response: Response;
    treatments: Response;
    public responseATLeft: any[] = [];
    public responseATRight: any[] = [];
    public responseADLeft: any[] = [];
    public responseADRight: any[] = [];

    public responseCTLeft: any[] = [];
    public responseCTRight: any[] = [];
    public responseCDLeft: any[] = [];
    public responseCDRight: any[] = [];

    public teeths: any[];
    public age: number;
    public id: number;
    @Input() patientSelect: Patient;
    @Input() personSelect: Person;
    catalogs: Array<any>;
    public diagnosisPlan: Diagnosis_Plan;
    responsePatient: any;

    constructor(private router: Router, private route: ActivatedRoute, private odontogramService: OdontogramService,
        private appGlobals: AppGlobals, private patientService: PatientService, private diagnosisPlanService: DiagnosisPlanService,
        private treatmentService: TreatmentService) {
    }

    ngOnInit() {
        this.odontogram = new Odontogram();
        this.initTooth();
        
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                this.id = +params['id'];
                this.getOdontogramByPatientId(this.id);
                this.odontogram.PatientId = this.id;

                this.patientSelect = new Patient();
                this.personSelect = new Person();
                this.patientService.getPatient(this.id)
                    .then(patient => {
                        this.responsePatient = patient;
                        this.patientSelect = this.responsePatient.Data;
                        this.personSelect = this.patientSelect.Person;
                        this.appGlobals.setPatient(this.patientSelect);
                        this.age = this.personSelect.Age;
                    });
                this.catalogs = JSON.parse(localStorage.getItem('catalog')).Data.ODONTOGRAMSTATUS;

                var idClinic = this.appGlobals.clinic.getValue().Id;
                this.treatmentService.getTreatmentsByClinic(idClinic)
                    .then(treatments => {
                        this.treatments = treatments.Data;
                    });

            }
            if (params['age'] != -1) {
                this.age = +params['age'];
            }
        });
    }

    getOdontogramByPatientId(idPatient) {
        this.response = new Response();
        this.odontogramService
            .getOdontogramByPatientId(idPatient)
            .then(response => {
                this.response = response;

                for (var item of this.response.Data) {
                    if (item.ToothNumber > 10 && item.ToothNumber < 19) {
                        this.responseATLeft.push(item);
                    }
                    if (item.ToothNumber > 20 && item.ToothNumber < 29) {
                        this.responseATRight.push(item);
                    }
                    if (item.ToothNumber > 40 && item.ToothNumber < 49) {
                        this.responseADLeft.push(item);
                    }
                    if (item.ToothNumber > 30 && item.ToothNumber < 39) {
                        this.responseADRight.push(item);
                    }

                    if (item.ToothNumber > 50 && item.ToothNumber < 56) {
                        this.responseCTLeft.push(item);
                    }
                    if (item.ToothNumber > 60 && item.ToothNumber < 66) {
                        this.responseCTRight.push(item);
                    }
                    if (item.ToothNumber > 80 && item.ToothNumber < 86) {
                        this.responseCDLeft.push(item);
                    }
                    if (item.ToothNumber > 70 && item.ToothNumber < 76) {
                        this.responseCDRight.push(item);
                    }
                }
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    showOdontogram(toothNumber) {
        this.odontogram = new Odontogram();
        this.initTooth();
        this.odontogram.ToothNumber = toothNumber;
        for (var item of this.response.Data) {
            if (item.ToothNumber == toothNumber) {
                this.odontogram.Tooth = item.Tooth;
            }
        }
    }


    save() {
        this.odontogram.Active = true;
        this.odontogram.PatientId = this.id;
        this.odontogram.ToothDetails = JSON.stringify(this.odontogram.Tooth);
        this.odontogramService.save(this.odontogram)
            .then(odontogram => {

                if (this.odontogram.ToothStatusId != 0) {
                    for (var i = 0; i < this.treatments.length; i++) {

                        if (this.treatments[i].TreatmentsTypeId == this.odontogram.ToothStatusId) {
                            this.diagnosisPlan = new Diagnosis_Plan();
                            this.diagnosisPlan.DoctorDiagnosticId = JSON.parse(localStorage.getItem('user')).Data.Employees[0].Id;
                            this.diagnosisPlan.DoctorExecuteId = this.diagnosisPlan.DoctorDiagnosticId;
                            this.diagnosisPlan.PatientId = this.id;
                            this.diagnosisPlan.TreatmentId = this.treatments[i].Id;
                            this.diagnosisPlan.TreatmentAmount = this.treatments[i].Price;
                            this.diagnosisPlan.PercentSpecialDiscount = this.treatments[i].Discount;
                            this.diagnosisPlan.Tooth = this.odontogram.ToothNumber.toString();

                            this.diagnosisPlanService.save(this.diagnosisPlan)
                                .then(diagnosisPlan => {
                                    this.isRequesting = false;
                                });
                        }
                    }
                }

            });
    }

    close() {
        this.initTooth();
    }

    goBack() {
        window.history.back();
    }

    selectSquare(face) {
        this.odontogram.Face = face;
        switch (this.odontogram.Face) {
            case "top":
                this.odontogram.Tooth.Top.Color = (this.odontogram.Tooth.Top.Color == '' ? 'bgm-gray' : '');
                break;
            case "bottom":
                this.odontogram.Tooth.Bottom.Color = (this.odontogram.Tooth.Bottom.Color == '' ? 'bgm-gray' : '');
                break;
            case "left":
                this.odontogram.Tooth.Left.Color = (this.odontogram.Tooth.Left.Color == '' ? 'bgm-gray' : '');
                break;
            case "right":
                this.odontogram.Tooth.Right.Color = (this.odontogram.Tooth.Right.Color == '' ? 'bgm-gray' : '');
                break;
            case "center":
                this.odontogram.Tooth.Center.Color = (this.odontogram.Tooth.Center.Color == '' ? 'bgm-gray' : '');
                break;
        }
    }

    selectTagColor(description, name, id) {

        var color = "";
        var diagnostic = "";
        var shape = "";
        var face = "";
        var treatmentsTypeIds = [];

        var res = description.split("|");
        color = res[0];
        diagnostic = res[1];
        shape = res[2];
        face = res[3];
        treatmentsTypeIds = res[4].split("-");

        var countFaces = 0;

        if (face == "all") {
            this.odontogram.Tooth.Shape = shape + "-" + color + "-" + face;
            this.odontogram.Tooth.Center.Color = "";
            this.odontogram.Tooth.Top.Diagnostic = "";
            this.odontogram.Tooth.Bottom.Diagnostic = "";
            this.odontogram.Tooth.Left.Diagnostic = "";
            this.odontogram.Tooth.Right.Diagnostic = "";

            this.odontogram.Tooth.Top.Diagnostic = diagnostic;
            this.odontogram.Tooth.Bottom.Diagnostic = diagnostic;
            this.odontogram.Tooth.Left.Diagnostic = diagnostic;
            this.odontogram.Tooth.Right.Diagnostic = diagnostic;
            this.odontogram.Tooth.Center.Diagnostic = diagnostic;
            countFaces += 1;
        }
        else {
            if (this.odontogram.Tooth.Top.Color != "") {
                this.odontogram.Tooth.Top.Color = color;
                this.odontogram.Tooth.Top.Diagnostic = diagnostic;
                this.odontogram.Tooth.Shape = "";
                countFaces += 1;
            }
            if (this.odontogram.Tooth.Bottom.Color != "") {
                this.odontogram.Tooth.Bottom.Color = color;
                this.odontogram.Tooth.Bottom.Diagnostic = diagnostic;
                this.odontogram.Tooth.Shape = "";
                countFaces += 1;
            }
            if (this.odontogram.Tooth.Left.Color != "") {
                this.odontogram.Tooth.Left.Color = color;
                this.odontogram.Tooth.Left.Diagnostic = diagnostic;
                this.odontogram.Tooth.Shape = "";
                countFaces += 1;
            }
            if (this.odontogram.Tooth.Right.Color != "") {
                this.odontogram.Tooth.Right.Color = color;
                this.odontogram.Tooth.Right.Diagnostic = diagnostic;
                this.odontogram.Tooth.Shape = "";
                countFaces += 1;
            }
            if (this.odontogram.Tooth.Center.Color != "") {
                this.odontogram.Tooth.Center.Color = color;
                this.odontogram.Tooth.Center.Diagnostic = diagnostic;
                this.odontogram.Tooth.Shape = "";
                countFaces += 1;
            }
        }

        if (countFaces > 3)
            countFaces = 3;

        this.odontogram.ToothStatusId = parseInt(treatmentsTypeIds[countFaces - 1]);
        this.legend = name;
    }

    initTooth() {
        this.odontogram.Tooth = { Top: { Color: '', Diagnostic: '' }, Bottom: { Color: '', Diagnostic: '' }, Left: { Color: '', Diagnostic: '' }, Right: { Color: '', Diagnostic: '' }, Center: { Color: '', Diagnostic: '' }, Shape: '' };
    }

}

