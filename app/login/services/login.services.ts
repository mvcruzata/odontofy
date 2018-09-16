import { Injectable}    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {User} from "../model/user";
import {ChangePassword} from "../model/changePassword";
import {CloudService} from "../../common/services/cloud.services";

@Injectable()
export class LoginService {

    private url = 'Account/';  // URL to web api
    error: any;

    constructor(private cloudService: CloudService) { }

    login(user: User) {
        let obj = "username=" + user.Email +
            "&password=" + user.Password +
            "&grant_type=password";
        return this.cloudService.postToken('Token', obj)
            .then(response => response)
            .catch(error => this.error = error);
    }

    register(user: User) {
        return this.cloudService.save(this.url + 'Register', user)
            .then(response => response)
            .catch(error => this.error = error);
    }

    forgetPassword(user) {
        return this.cloudService.save(this.url + 'ForgetPassword', user)
            .then(response => response)
            .catch(error => this.error = error);
    } 

    changePassword(changePassword: ChangePassword) {
        return this.cloudService.save(this.url + 'ChangePassword', changePassword)
            .then(response => response)
            .catch(error => this.error = error);
    } 

    changeForgetPassword(changePassword: ChangePassword) {
        return this.cloudService.postWithToken(this.url + 'ForgetChangePassword', changePassword, changePassword.Token)
            .then(response => response)
            .catch(error => this.error = error);
    } 

    logout() {
        return this.cloudService.save(this.url + 'Logout', null)
            .then(response => response)
            .catch(error => this.error = error);
    } 

}


