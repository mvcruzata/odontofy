// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';

// The usual bootstrapping imports
import { bootstrap }      from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

import { AppComponent }         from './app.component';
import { appRouterProviders }   from './app.routes';
import {LocalStorageService, LocalStorageSubscriber} from 'angular2-localstorage/LocalStorageEmitter';
import {EmailValidator} from "./common/directives/email.directives";
import {
LocationStrategy,
HashLocationStrategy
} from '@angular/common';

bootstrap(AppComponent, [
    appRouterProviders,
    HTTP_PROVIDERS,
    EmailValidator,
    disableDeprecatedForms(),     // Disable old Forms API!
    provideForms(),                // Use new Forms API!
// providers used to create fake backend
    //{ provide: XHRBackend},
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    LocalStorageService
]);

