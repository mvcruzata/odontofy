import { Component } from '@angular/core';
import { Router }           from '@angular/router';

@Component({
    selector: 'histories',
    templateUrl: './app/patients/histories/histories.html'
})
export class HistoriesComponent {
    title = 'Histories';

    constructor(private router:Router) {
    }

}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */