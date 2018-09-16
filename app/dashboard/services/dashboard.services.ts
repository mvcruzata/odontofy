import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Todo } from "../model/todo";
import { Invitation } from "../model/invitation"
import { CloudService } from "../../common/services/cloud.services";

@Injectable()
export class DashBoardService {

    private todoListUrl = 'TodoList';  // URL to web api
    private invitationUrl = 'Invitation';  // URL to web api
    private todo: Todo;
    private invited: Invitation;
    error: any;

    constructor(private cloudService: CloudService) { }

    getGetClinicsByEmployeeId(idEmployee) {
        return this.cloudService
            .getById("Clinic/GetByEmployeeId", idEmployee)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getGetClinicData(id) {
        return this.cloudService
            .getById("Clinic/GetData", id)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getTodoList(clinicOwner, person) {
        return this.cloudService.get(this.todoListUrl + '/' + clinicOwner + '/' + person)
            .then(response => response)
            .catch(error => this.error = error);
    }

    getAllTodoList(clinicOwner, person) {
        return this.cloudService.get(this.todoListUrl + 'All' + '/' + clinicOwner + '/' + person)
            .then(response => response)
            .catch(error => this.error = error);
    }

    saveTodoList(todo: Todo) {
        return this.cloudService.save(this.todoListUrl, todo);
    }

    deleteTodoList(todo: Todo) {
        return this.cloudService.deleteById(this.todoListUrl, todo.Id);
    }

    saveInvitation(invited: Invitation) {
        return this.cloudService.save(this.todoListUrl, invited);
    }
}

