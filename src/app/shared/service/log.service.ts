import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
export function RBLOG(text: any, data?: any) {
  const styles = ['color: white', 'background: red', 'font-size:20px'].join(';');
  if (!environment.production)
    console.log('%c%s', styles, text, data);
}
@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }
  addToConsole(text: string) {
    if (!environment.production)
      console.log(text);
  }
  addToConsoleAsString(body: any) {
    // if (!environment.production)
    //   console.log(JSON.stringify(body));
  }
  showAlert(text: string) {
    // if (!environment.production)
    //   alert(text);
  }

}
