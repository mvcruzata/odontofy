import { provideRouter, RouterConfig }  from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { OdontogramComponent } from './odontogram/odontogram.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AccountingComponent } from "./accounting/accounting.component";
import { TreatmentsComponent } from "./treatments/treatments.component";
import { EmployeesComponent } from "./employees/employees.component";
import { DataPersonalComponent } from "./patients/data-personal/data-personal.component";
import { HistoriesComponent } from "./patients/histories/histories.component";
import { PatiensFormComponent } from "./patients/data-personal/form/patiens-form.component";
import {TreatmentsFormComponent} from "./treatments/form/treatments-form.component";
import {EmployeesFormComponent} from "./employees/form/employees-form.component";
import {AppoitmentFormComponent} from "./calendar/form/appoitment-form.component";
import {DiagnosisPlanComponent} from "./diagnosis-plan/diagnosis-plan.component";
import {DiagnosisPlanFormComponent} from "./diagnosis-plan/form/diagnosis-plan-form.component";
import {PatiensViewComponent} from "./patients/data-personal/view/patiens-view.component";
import {ProfileComponent} from "./profile/profile.component";
import {LoginComponent} from "./login/login.component";
import {AccountingDetaillsComponent} from "./accounting/detaills/detaills.component";
import {ConsultationComponent} from "./consultation/consultation.component";
import {ConsultationFormComponent} from "./consultation/form/consultation-form.component";
import {ChartsComponent} from "./reports/charts.component";
import {NotificationComponent} from "./notification/notification.component";
import {AppComponent } from "./app.component";
import {PatientDashBoardComponent } from "./patients/dashboard/dashboard.component";
import {ClinicComponent } from "./clinic/clinic.component";
import {BillingComponent } from "./billing/billing.component";


const routes:RouterConfig = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'changeclinic/:type/:id/:name',
        component: DashboardComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register/:planId',
        component: LoginComponent,
    },
    {
        path: 'referred/:code',
        component: LoginComponent,
    },
    {
        path: 'changePass/:id/:token',
        component: LoginComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'odontogram/:id/:age',
        component: OdontogramComponent
    },
    {
        path: 'calendar',
        component: CalendarComponent
    },
    {
        path: 'appoitments/:id/:start',
        component: AppoitmentFormComponent
    },
    {
        path: 'data-personal',
        component: DataPersonalComponent
    },
    {
        path: 'patiens/:id',
        component: PatiensFormComponent
    },
    {
        path: 'patiens-view/:id',
        component: PatiensViewComponent
    }, 
    {
        path: 'patiens-dashboard/:id',
        component: PatientDashBoardComponent
    },
    {
        path: 'diagnosis-plan/:id',
        component: DiagnosisPlanComponent
    },
    {
        path: 'diagnosis-plan-form/:id',
        component: DiagnosisPlanFormComponent
    },
    {
        path: 'histories',
        component: HistoriesComponent
    },
    {
        path: 'accounting-all/:status',
        component: AccountingComponent
    },
    {
        path: 'accounting/:id/:status',
        component: AccountingDetaillsComponent
    }, 
    {
        path: 'treatments',
        component: TreatmentsComponent
    },
    {
        path: 'treatments/:id',
        component: TreatmentsFormComponent
    },
    {
        path: 'employees',
        component: EmployeesComponent
    },
    {
        path: 'employees/:id',
        component: EmployeesFormComponent
    },
    {
        path: 'consultation/:id',
        component: ConsultationComponent
    },
    {
        path: 'consultation-form/:id',
        component: ConsultationFormComponent
    },
    {
        path: 'charts/:type',
        component: ChartsComponent
    },
    {
        path: 'notifications',
        component: NotificationComponent
    },
    {
        path: 'clinics',
        component: ClinicComponent
    },
    {
        path: 'billing',
        component: BillingComponent
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];

