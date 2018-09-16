'use strict';

import {Component, Input, OnDestroy} from '@angular/core';

@Component({
    selector: 'spinner-content',
    templateUrl: 'app/common/spinner/spinner.html',
    styleUrls: ['app/common/spinner/spinner.css']
})
export class SpinnerComponent implements OnDestroy {
    private currentTimeout: number;
    private isDelayedRunning: boolean = false;
  
    @Input()
    public delay: number = 10;

    @Input()
    public set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
        }

        if (this.currentTimeout) {
            return;
        }

        setTimeout(() => {
            this.isDelayedRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    private cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
    }
    
}