import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { Alert, AlertType } from '../models/alert.model';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private subject = new Subject<Alert | null>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }
    showMessage(isSuccess: boolean, message: string) {
        if (isSuccess)
            this.alert(AlertType.Success, message);
        else
            this.alert(AlertType.Error, message);
    }
    success(message: string, keepAfterRouteChange = false) {
        // alert("on success :"+message);  
        this.alert(AlertType.Success, message, keepAfterRouteChange);
    }

    error(message: string, keepAfterRouteChange = false) {
        this.alert(AlertType.Error, message, keepAfterRouteChange);
    }

    info(message: string, keepAfterRouteChange = false) {
        this.alert(AlertType.Info, message, keepAfterRouteChange);
    }

    warn(message: string, keepAfterRouteChange = false) {
        this.alert(AlertType.Warning, message, keepAfterRouteChange);
    }

    alert(type: AlertType, message: string, keepAfterRouteChange = false) {
        //alert("on change next "+message);
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Alert>{ type: type, message: message });
    }

    clear() {
        // clear alerts
        this.subject.next(null);
    }
}
