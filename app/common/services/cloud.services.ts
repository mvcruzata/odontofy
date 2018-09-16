import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, ConnectionBackend, RequestOptions, Response } from '@angular/http';
import { RuntimeCompiler } from '@angular/compiler/src/runtime_compiler';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CloudService {

   // private apiUrl = 'http://localhost:21737/api/';  // URL to web api
    private apiUrl = 'http://web.odontofy.com/OdontoFyWebApi/api/';

    private headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
    });

    private headersUrlencoded = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '
    });

    constructor(private http: Http) {

    }

    get(url) {
        return this.http.get(this.apiUrl + url, { headers: this.getHeader(null) })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getById(url, id: number) {

        return this.http.get(this.apiUrl + url + "/" + id, { headers: this.getHeader(null) })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    save(url, obj): Promise<Object> {
        if (obj.Id && obj.Id > -1) {
            return this.put(url, obj);
        }
        return this.post(url, obj);
    }

    delete(url, obj) {
        return this.http
            .delete(this.apiUrl + url + "/" + obj.id, { headers: this.getHeader(null) })
            .toPromise()
            .catch(this.handleError);
    }

    deleteById(url, id: number) {
        return this.http
            .delete(this.apiUrl + url + "/" + id, { headers: this.getHeader(null) })
            .toPromise()
            .catch(this.handleError);
    }

    private post(url, obj): Promise<Object> {
        return this.http
            .post(this.apiUrl + url, JSON.stringify(obj), { headers: this.getHeader(null) })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    postToken(url, obj): Promise<Object> {
        return this.http
            .post(this.apiUrl + url, obj, { headers: this.headersUrlencoded })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    postWithToken(url, obj, token): Promise<Object> {
        return this.http
            .post(this.apiUrl + url, JSON.stringify(obj), { headers: this.getHeader(token) })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private put(url, obj) {
        return this.http
            .put(this.apiUrl + url, JSON.stringify(obj), { headers: this.getHeader(null) })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        var result = {
            status: "failed",
            message: (error.message || error)
        }
        return result;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private getHeader(token) {
        return this.headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).access_token : token)
        });
    }
}

