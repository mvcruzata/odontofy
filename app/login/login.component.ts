import { Component, OnInit, Input } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from "../common/globals/globals";
import { LocalStorage, SessionStorage } from "angular2-localstorage/WebStorage";
import { User } from "./model/user";
import { ChangePassword } from "./model/changePassword";
import { Token } from "./model/token";
import { LoginService } from "./services/login.services";
import { ProfileService } from "../profile/services/profile.services";
import { CatalogsService } from "../common/catalogs/services/catalogs.services";
import { Response } from "../common/response/model/response";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { ReferralsService } from "../referrals/services/referrals.services";
import { Referred } from "../referrals/model/referred";
import { RuntimeCompiler } from '@angular/compiler';


@Component({
    selector: 'login',
    templateUrl: './app/login/login.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent]
})
export class LoginComponent implements OnInit {
    title = 'Login';

    @Input() user: User;
    public isRequesting: boolean = false;
    error: any;
    response: Response;
    sub: any;
    changePass: ChangePassword;
    isChangePassword: boolean;
    isSendEmail: boolean;
    loginToggled: string = "toggled";
    registerToggled: string;
    forgetPasswordToggled: string;
    changePasswordToggled: string;
    noneToggled: string;
    paymentsTypes: Array<any>;
    clinicsTypes: Array<any>;
    codeReferred: string = "";

    @LocalStorage("isLogin") public isLogin: boolean;
    @LocalStorage("token") public token: any;
    constructor(private route: ActivatedRoute, private router: Router, private appGlobals: AppGlobals, private loginService: LoginService,
        private profileService: ProfileService, private catalogsService: CatalogsService, private referralsService: ReferralsService,
        private _runtimeCompiler: RuntimeCompiler) {
        this.error = false;
        this.response = new Response();
    }

    ngOnInit() {

        this.user = new User();
        this.changePass = new ChangePassword();
        this.isSendEmail = false;

        var url = window.location.hash;
        var parameters = url.split('/');
        if (parameters[1] == "changePass") {
            this.changePass.Id = parameters[2];
            this.changePass.Token = "";
            for (var i = 3; i < parameters.length; i++) {
                this.changePass.Token += parameters[i];
                if (i == parameters.length - 2)
                    this.changePass.Token += "/";
            }

            this.changePasswordToggled = "toggled";
            this.loginToggled = "";
        }

        if (parameters[1] == "register") {
            this.registerToggled = "toggled";
            this.loginToggled = "";
            this.user.PaymentPlanId = parseInt(parameters[2]);
        }

        if (localStorage.getItem("user") && localStorage.getItem("user") != "") {
            let roles = JSON.parse(localStorage.getItem("user")).Data.Role;
            this.definePermission(roles);
            this.isRequesting = false;
            window.location.href = '#/dashboard';
        }

        if (parameters[1] == "referred") {
            this.registerToggled = "toggled";
            this.loginToggled = "";
            this.codeReferred = parameters[2];
        }

        this.getCatalogs();
    }

    login() {
        this.appGlobals.setIsRequestingGlobal(true);
        this.isRequesting = true;
        this.token = new Token();
        this.response = new Response();
        this.error = false;
        this.loginService
            .login(this.user)
            .then(response => {
                if (response.status != 'failed') {
                    localStorage.setItem("token", JSON.stringify(response));
                    this.user.Id = response.Id;
                    this.loadProfile();
                }
                else {
                    this.error = true;
                    this.appGlobals.setLoginStatus(false);
                    localStorage.setItem("token", "");
                    this.response.Message = JSON.parse(response.message._body).error_description;
                    this.isRequesting = false;
                    this.appGlobals.setIsRequestingGlobal(false);
                    this.loginToggled = "toggled";
                }
            })
            .catch(error => {
                this.appGlobals.setLoginStatus(false);
                this.error = error;
                this.isRequesting = false;
                this.appGlobals.setIsRequestingGlobal(false);
                this.loginToggled = "toggled";
            });
    }

    register() {
        this.appGlobals.setIsRequestingGlobal(true);
        this.isRequesting = true;
        if (/*this.user.LicenseAgreement && (*/this.user.ImProfesional || this.user.IHaveClinic/*)*/) {
            this.user.ConfirmPassword = this.user.Password;
            this.user.LicenseAgreement = true;
            this.loginService
                .register(this.user)
                .then(response => {
                    if (response.Code != "ERROR") {
                        this.login();
                    }
                    else {
                        this.error = true;
                        this.appGlobals.setLoginStatus(false);
                        localStorage.setItem("token", "");
                        this.response.Message = response.Message;
                        this.isRequesting = false;
                        this.appGlobals.setIsRequestingGlobal(false);
                        this.registerToggled = "toggled";
                        this.loginToggled = "";
                    }
                })
                .catch(error => {
                    this.appGlobals.setLoginStatus(false);
                    this.error = true;
                    this.isRequesting = false;
                    this.appGlobals.setIsRequestingGlobal(false);
                    this.registerToggled = "toggled";
                    this.loginToggled = "";
                });
        } else {
            this.error = true;
            this.isRequesting = false;
            this.appGlobals.setIsRequestingGlobal(false);
            this.registerToggled = "toggled";
            this.response.Message = "Debe cumplir los Requerimientos";
        }
    }

    forgetPassword() {
        this.appGlobals.setIsRequestingGlobal(true);
        this.isRequesting = true;
        let objForgetPassword = { userName: this.user.Email, Email: this.user.Email }
        this.loginService
            .forgetPassword(objForgetPassword)
            .then(response => {
                this.token = response;
                this.isRequesting = false;
                this.isSendEmail = true;
                this.appGlobals.setIsRequestingGlobal(false);
            })
            .catch(error => {
                this.appGlobals.setLoginStatus(false);
                this.error = error;
                this.isRequesting = false;
                this.appGlobals.setIsRequestingGlobal(false);
                this.registerToggled = "toggled";
            });
    }

    changeForgetPassword() {
        this.appGlobals.setIsRequestingGlobal(true);
        this.isRequesting = true;
        this.loginService
            .changeForgetPassword(this.changePass)
            .then(response => {
                this.user = new User();
                this.user.Username = response.Data.UserName;
                this.user.Email = response.Data.Email;
                this.user.Password = this.changePass.Password;
                this.login();
            })
            .catch(error => this.error = error);
    }

    loadProfile() {
        this.profileService
            .getProfilebyUserId(this.user.Id)
            .then(response => {
                this.clearCache(response);
                localStorage.setItem("user", JSON.stringify(response));
                this.appGlobals.setUserName(response.Data.Name + " " + response.Data.LastNames);
                this.definePermission(response.Data.Role);

                this.appGlobals.setIsRequestingGlobal(false);
                this.isRequesting = false;
                this.appGlobals.setLoginStatus(true);

                if (this.codeReferred != "") {
                    var referred = new Referred();
                    referred.Code = this.codeReferred;
                    this.saveReferral(referred);
                    this.codeReferred = "";
                }
                window.location.href = '#/dashboard';
            })
            .catch(error => this.error = error);
    }

    getCatalogs() {
        this.catalogsService
            .getCatalogs()
            .then(response => {
                localStorage.setItem("catalog", JSON.stringify(response));
                this.appGlobals.setIsRequestingGlobal(false);
                this.isRequesting = false;
                this.clinicsTypes = JSON.parse(localStorage.getItem('catalog')).Data.CLINICTYPES;
                if (this.user.ClinicSpecialtyId == null || this.user.ClinicSpecialtyId == undefined)
                    this.user.ClinicSpecialtyId = -1;
            })
            .catch(error => {
                this.error = error;
                this.isRequesting = false;
            });
    }

    saveReferral(referred: Referred) {
        this.referralsService
            .saveReferral(referred)
            .then(response => { })
            .catch(error => this.error = error);
    }

    definePermission(roles) {
        this.appGlobals.setRoleAdmin(false);
        this.appGlobals.setRoleSecretary(false);
        this.appGlobals.setRoleDoctor(false);
        this.appGlobals.setRoleBase(false);
        if (roles.indexOf("ADMIN") !== -1)
            this.appGlobals.setRoleAdmin(true);
        if (roles.indexOf("ADMIN") !== -1 || roles.indexOf("SECRETARIA") !== -1)
            this.appGlobals.setRoleSecretary(true);
        if (roles.indexOf("ADMIN") !== -1 || roles.indexOf("SECRETARIA") !== -1 || roles.indexOf("DOCTOR") !== -1)
            this.appGlobals.setRoleDoctor(true);
        if (roles.indexOf("ADMIN") !== -1 || roles.indexOf("SECRETARIA") !== -1 || roles.indexOf("DOCTOR") !== -1 || roles.indexOf("BASE") !== -1)
            this.appGlobals.setRoleBase(true);
    }

    showBlock(value) {
        this.initVariables();
        switch (value) {
            case "login":
                this.loginToggled = "toggled";
                break;
            case "register":
                this.registerToggled = "toggled";
                break;
            case "forget-password":
                this.forgetPasswordToggled = "toggled";
                break;
            case "change-password":
                this.changePasswordToggled = "toggled";
                break;
        }
    }

    initVariables() {
        this.loginToggled = "";
        this.registerToggled = "";
        this.forgetPasswordToggled = "";
        this.changePasswordToggled = "";
        this.noneToggled = "";
    }

    clearCache(response: Response) {
        if (response.Version != localStorage.getItem("version")) {
            var token = localStorage.getItem("token");
            this._runtimeCompiler.clearCache();
            localStorage.setItem("version", response.Version);
            localStorage.setItem("token", token);
        }
    }

}