import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { DataTableDirectives } from 'angular2-datatable/datatable';
import * as _ from 'lodash';
import { Response } from "../../common/response/model/response";
import { PatientService } from "../services/patients.services";
import { AppGlobals } from "../../common/globals/globals";
import { SpinnerComponent } from "../../common/spinner/spinner.component";
import { DashBoardService } from "../../dashboard/services/dashboard.services";
import { OdontogramComponent } from '../../odontogram/odontogram.component';
import { DiagnosisPlanComponent } from '../../diagnosis-plan/diagnosis-plan.component';
import { PatiensViewComponent } from '../data-personal/view/patiens-view.component';
import { Patient } from "../model/patient";
import { Person } from "../../profile/model/person";
import { Diagnosis_Plan } from "../../diagnosis-plan/model/diagnosis-plan";
import { ProfileService } from "../../profile/services/profile.services";
import { DiagnosisPlanService } from "../../diagnosis-plan/services/diagnosis-plan.services";
import { AccountingDetaillsGeneralComponent } from "../../accounting/detaills/component/detaills.component";
import { FileUploaderComponent } from "../../files/file.component";
import { FileService } from "../../files/services/files.services";
import { File } from "../../files/model/file";
import { Clinic } from "../../clinic/model/clinic";
import { AppoitmentService } from "../../calendar/services/appoiments.services";
import { Appoiment } from "../../calendar/model/appoiment"

@Component({
    selector: 'patient-dashboard',
    templateUrl: './app/patients/dashboard/dashboard.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives, OdontogramComponent, DiagnosisPlanComponent, PatiensViewComponent, AccountingDetaillsGeneralComponent, FileUploaderComponent]
})
export class PatientDashBoardComponent implements OnInit {
    title = 'Paciente';


    @Input() patient: Patient;
    @Input() person: Person;
    @Input() appoiment: Appoiment;
    navigated = false;
    sub: any;
    vitalSigns: any;
    stomatognathicSystem: any;
    response: Response;
    private diagnosis_plans: Array<Diagnosis_Plan>;
    public isRequesting: boolean = true;
    filesPatient: string[] = [];
    profileImg: string = '../img/profile-pics/no-photo.jpg';
    public clinic: Clinic;
    public hiddenOdonto: boolean = true;
    imageSrcBefore: string = '';
    imageSrcAfter: string = '';
    isSuperAdmin: boolean = false;

    constructor(private router: Router, private route: ActivatedRoute, private appGlobals: AppGlobals, private patientService: PatientService,
        private profileService: ProfileService, private diagnosisPlanService: DiagnosisPlanService, private fileService: FileService, private appoitmentService: AppoitmentService) {
    }

    ngOnInit() {

        var user = JSON.parse(localStorage.getItem('user')).Data;
        this.isSuperAdmin = user.Id == 3;

        this.clinic = user.Clinics[0];

        if (this.clinic != undefined) {
            if (this.clinic.Clinic_Specialties.length > 0 && this.clinic.Clinic_Specialties[0].SpecialtiesId != null && this.clinic.Clinic_Specialties[0].SpecialtiesId != undefined)
                this.clinic.SpecialtyId = this.clinic.Clinic_Specialties[0].SpecialtiesId;
            else
                this.clinic.SpecialtyId = -1;

            this.hiddenOdonto = false; //JSON.parse(localStorage.getItem('catalog')).Data.CLINICTYPES.filter(x => x.Id == this.clinic.SpecialtyId)[0].Description != 'ODONTO';
        }
        else
            this.hiddenOdonto = false;

        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                let id = +params['id'];
                this.navigated = true;
                this.patient = new Patient();
                this.person = new Person();
                this.patientService.getPatient(id)
                    .then(patient => {
                        this.response = patient;
                        this.patient = this.response.Data;
                        this.person = this.patient.Person;
                        var datePipe = new DatePipe();
                        this.person.DateOfBirth = datePipe.transform(this.person.DateOfBirth, 'yyyy-MM-dd');

                        this.patient.personalAndFamilyHistory = this.patient.Patients_Catalog_By_Type.PERSONALANDFAMILYHISTORY;
                        this.patient.vitalSigns = this.patient.Patients_Catalog_By_Type.VITALSIGNS;
                        this.patient.stomatognathicSystem = this.patient.Patients_Catalog_By_Type.STOMATOGNATHICSYSTEM;
                        this.getFilesById();
                        this.isRequesting = false;
                    });
            } else {
                this.navigated = false;
                this.patient = new Patient();
                this.person = new Person();

                this.patient.personalAndFamilyHistory = JSON.parse(localStorage.getItem('catalog')).Data.PERSONALANDFAMILYHISTORY;
                this.patient.vitalSigns = JSON.parse(localStorage.getItem('catalog')).Data.VITALSIGNS;
                this.patient.stomatognathicSystem = JSON.parse(localStorage.getItem('catalog')).Data.STOMATOGNATHICSYSTEM;
            }
        });

        this.appoiment = new Appoiment();
        this.appoiment.DateType = "month";

    }

    delete(id) {

    }

    ngAfterViewInit() {

    }

    addFileStatus(status): void {
        var obj = document.getElementById("image-" + status);
        var binaryString = obj.childNodes[0].childNodes[3].currentSrc;

        var file = new File();
        file.Model = status == "All" ? "Patient" : "Patient-" + status;
        file.ModelId = this.patient.Id.toString();
        file.Name = "Patient-" + this.patient.Id.toString();
        file.Base64 = binaryString.split(',')[1];
        if (file.Base64 != undefined) {
            this.fileService.save(file)
                .then(file => {
                    var image = new File();
                    image = file.Data;
                    if (status == "All") {
                        document.getElementById("imageSrc").src = "";
                        this.filesPatient.push("http://web.odontofy.com/OdontoFyWebApi/api/File/ById/" + image.Id);
                    }
                    if (status == "Before") {
                        this.imageSrcBefore = "http://web.odontofy.com/OdontoFyWebApi/api/File/ById/" + image.Id;
                    }
                    if (status == "After") {
                        this.imageSrcAfter = "http://web.odontofy.com/OdontoFyWebApi/api/File/ById/" + image.Id;
                    }
                });
        }
    }

    close() {
        document.getElementById("imageSrc").src = "";
    }

    getFilesById() {

        this.fileService.getFileByModelId("Profile", this.person.Id)
            .then(files => {
                for (var i = 0; i < files.Data.length; i++) {
                    this.profileImg = "http://web.odontofy.com/OdontoFyWebApi/api/File/ById/" + files.Data[i].Id;
                }
            });

        this.fileService.getFileByModelId("Patient", this.patient.Id)
            .then(files => {
                this.filesPatient = [];
                for (var i = 0; i < files.Data.length; i++) {
                    this.filesPatient.push("http://web.odontofy.com/OdontoFyWebApi/api/File/ById/" + files.Data[i].Id);
                }
            });

        this.fileService.getFileByModelId("Patient-Before", this.patient.Id)
            .then(files => {
                for (var i = 0; i < files.Data.length; i++) {
                    this.imageSrcBefore = "http://web.odontofy.com/OdontoFyWebApi/api/File/ById/" + files.Data[i].Id;
                }
            });

        this.fileService.getFileByModelId("Patient-After", this.patient.Id)
            .then(files => {
                for (var i = 0; i < files.Data.length; i++) {
                    this.imageSrcAfter = "http://web.odontofy.com/OdontoFyWebApi/api/File/ById/" + files.Data[i].Id;
                }
            });
    }

    zoomImage(file) {
        document.getElementById("zoomImg").src = file;
    }

    deleteFile() {
        var uelementsDeleteImage = document.getElementById("zoomImg").src.split('/');
        var idDeleteImage = uelementsDeleteImage[uelementsDeleteImage.length - 1];
        this.fileService.delete(idDeleteImage)
            .then(files => {
                this.getFilesById();
            });
    }

    createNextAppoiment() {
        if (this.appoiment.CantDateType != null) {
            this.appoiment.Status = "PLANNED";
            this.appoiment.ClinicId = this.appGlobals.clinic.getValue().Id;
            this.appoiment.PatientId = this.patient.Id;
            this.appoiment.ClassName = "bgm-red";
            this.appoitmentService.save(this.appoiment)
                .then(response => { })
                .catch(error => this.error = error);
        }
    }

    print() {
        let popupWinindow
        let innerContents = document.getElementById("patientView").innerHTML;
        popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
        popupWinindow.document.close();
    }
    
}

