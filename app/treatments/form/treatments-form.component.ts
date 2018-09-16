import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { TreatmentService } from "../services/treatments.services";
import { Treatment } from '../model/treatment';
import { LocalStorage, SessionStorage } from "angular2-localstorage/WebStorage";
import { AppGlobals } from "../../common/globals/globals";
import { SpinnerComponent } from "../../common/spinner/spinner.component";
import { Clinic } from "../../clinic/model/clinic";
import { CatalogsService } from "../../common/catalogs/services/catalogs.services";
import { CCatalog } from "../../common/catalogs/model/ccatalog";
import { NotificationMessage } from "../../common/notification/notification.services";
import { ClinicService } from "../../clinic/services/clinic.services";
import { Response } from "../../common/response/model/response";

@Component({
    selector: 'treatments-form',
    templateUrl: './app/treatments/form/treatments-form.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent]
})
export class TreatmentsFormComponent implements OnInit, OnDestroy {

    @Input() treatment: Treatment;
    @Output() close = new EventEmitter();
    title = 'Tratamiento';
    sub_title = 'Configure el tratamiento';
    sub_title_description = 'Configurar el precio y el descuento del tratamiento';
    navigated = false; // true if navigated here
    sub: any;
    response: Response;
    public cat: any;
    public treatmentsTypes: any;
    public treatmentsTypesAll: any;
    public specialitiesTypes: any;
    public clinicType: string;
    public isRequesting: boolean;
    public clinic: Clinic;
    public newTreatment: boolean = false;

    constructor(private treatmentService: TreatmentService, private catalogsService: CatalogsService, private clinicService: ClinicService,
        private route: ActivatedRoute, private appGlobals: AppGlobals, private notification: NotificationMessage) {
        this.treatment = new Treatment();
    }

    ngOnInit() {
        this.getClinic();
    }

    getClinic() {
        var idCLinic = this.appGlobals.clinic.getValue().Id;
        this.clinicService.getClinicById(idCLinic)
            .then(response => {
                this.response = response;
                this.clinic = this.response.Data;

                if (this.clinic.PaymentPlanId == null || this.clinic.PaymentPlanId == undefined)
                    this.clinic.PaymentPlanId = -1;

                if (this.clinic.Clinic_Specialties.length > 0 && this.clinic.Clinic_Specialties[0].SpecialtiesId != null && this.clinic.Clinic_Specialties[0].SpecialtiesId != undefined)
                    this.clinic.SpecialtyId = this.clinic.Clinic_Specialties[0].SpecialtiesId;
                else
                    this.clinic.SpecialtyId = -1;

                //this.clinicType = JSON.parse(localStorage.getItem('catalog')).Data.CLINICTYPES.filter(x => x.Id == this.clinic.SpecialtyId)[0].Description;
                this.treatmentsTypesAll = JSON.parse(localStorage.getItem('catalog')).Data['TREATMENTSTYPES-ODONTO'];// + this.clinicType];
                this.specialitiesTypes = JSON.parse(localStorage.getItem('catalog')).Data.SPECIALTIES;

                this.initTreatment();

            });
    }

    initTreatment() {
        this.navigated = true;
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] != -1) {
                let id = +params['id'];
                this.treatment = new Treatment();
                this.treatmentService.getTreatment(id)
                    .then(treatment => {
                        this.treatment = treatment.Data
                        this.treatment.SpecialityTypeId = this.treatment.CCatalog.Parent;
                        this.selectSpeciality(this.treatment.SpecialityTypeId);
                    });
            } else {
                this.treatment = new Treatment();
            }
        });
    }


    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    save() {

        if (this.treatment.TreatmentType != undefined && this.treatment.TreatmentType != "") {
            this.saveNewTreatmentType();
        } else {
            this.saveTreatment();
        }
    }

    saveTreatment() {
        this.isRequesting = true;
        this.treatment.ClinicId = this.appGlobals.clinic.getValue().Id;
        this.treatment.Status = true;
        this.treatmentService.save(this.treatment)
            .then(treatment => {
                this.isRequesting = false;
                this.notification.notifySuccess("Guardar tratamiento");
                window.history.back();
            });
    }

    saveNewTreatmentType() {
        var ccatalog = new CCatalog();
        ccatalog.Key = "TREATMENTSTYPES-" + this.clinicType;
        ccatalog.Description = this.treatment.TreatmentType;
        ccatalog.Name = this.treatment.TreatmentType;
        ccatalog.Parent = this.treatment.SpecialityTypeId;
        ccatalog.Active = true;

        this.catalogsService.save(ccatalog)
            .then(treatment => {

                var catalogs = JSON.parse(localStorage.getItem('catalog'));
                catalogs.Data['TREATMENTSTYPES-' + this.clinicType].push({ CatalogId: treatment.Id, Description: ccatalog.Name, Id: treatment.Id, Name: ccatalog.Name, Type: ccatalog.Key });
                localStorage.setItem("catalog", JSON.stringify(catalogs));

                this.treatment.TreatmentsTypeId = treatment.Data.Id;
                this.saveTreatment();
            });
    }

    cancel(savedTreatment: Treatment = null) {
        this.close.emit(savedTreatment);
        if (this.navigated) { window.history.back(); }
    }
    goBack(savedTreatment: Treatment = null) {
        this.close.emit(savedTreatment);
        if (this.navigated) { window.history.back(); }
    }

    addTreatmentType() {
        this.newTreatment = true;
    }

    showTreatmentType() {
        this.newTreatment = false;
    }

    selectSpeciality(value) {
        this.treatmentsTypes = this.treatmentsTypesAll.filter(x => x.Parent == value);
    }
}


