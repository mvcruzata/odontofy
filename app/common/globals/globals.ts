import {Observable} from 'rxjs/Observable';
import { Injectable }    from '@angular/core';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import {BehaviorSubject} from 'rxjs/BehaviorSubject'; 1
import { Response } from "../response/model/response";
import { Clinic } from "../../clinic/model/clinic";

@Injectable()
export class AppGlobals {
   // use this property for property binding
    public isUserLoggedIn:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    setLoginStatus(isLoggedIn) {
        this.isUserLoggedIn.next(isLoggedIn);
    }

    public userName: BehaviorSubject<object> = new BehaviorSubject<object>({});

    setUserName(userName) {
        this.userName.next(userName);
    }

    public isRequestingGlobal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    setIsRequestingGlobal(isRequestingGlobal) {
        this.isRequestingGlobal.next(isRequestingGlobal);
    }

    public clinic: BehaviorSubject<object> = new BehaviorSubject<object>({ "Id": -1, "Name": ""});

    setClinic(clinic) {
        this.clinic.next(clinic);
    }

    public clinicsOwners: BehaviorSubject<Response> = new BehaviorSubject<Response>(new Response());

    setClinicsOwners(clinicsOwners) {
        this.clinicsOwners.next(clinicsOwners);
    }

    public clinicsWorkers: BehaviorSubject<Response> = new BehaviorSubject<Response>(new Response());

    setClinicsWorkers(clinicsWorkers) {
        this.clinicsWorkers.next(clinicsWorkers);
    }

    public owner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    setOwner(owner) {
        this.owner.next(owner);
    }

    public patient: BehaviorSubject<object> = new BehaviorSubject<object>({});

    setPatient(patient) {
        this.patient.next(patient);
    }

    public roleAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    setRoleAdmin(roleAdmin) {
        this.roleAdmin.next(roleAdmin);
    }
    
    public roleDoctor: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    setRoleDoctor(roleDoctor) {
        this.roleDoctor.next(roleDoctor);
    }

    public roleSecretary: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    setRoleSecretary(roleSecretary) {
        this.roleSecretary.next(roleSecretary);
    }

    public roleBase: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    setRoleBase(roleBase) {
        this.roleBase.next(roleBase);
    }

    public query: BehaviorSubject<string> = new BehaviorSubject<string>("!");

    setQuery(query) {
        this.query.next(query);
    }

    public numberNotifications: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    setNumberNotifications(numberNotifications) {
        this.numberNotifications.next(numberNotifications);
    }

    public notifications: BehaviorSubject<Response> = new BehaviorSubject<Response>(new Response());

    setNotifications(notifications) {
        this.notifications.next(notifications);
    }

    public diagnosisPlan: BehaviorSubject<Response> = new BehaviorSubject<Response>(new Response());

    setDiagnosisPlan(diagnosisPlan) {
        this.diagnosisPlan.next(diagnosisPlan);
    }
    
}