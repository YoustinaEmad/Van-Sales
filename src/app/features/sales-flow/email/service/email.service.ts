import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { EmailViewModel } from '../interface/email-view-model';
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private _apiService: ApiService) { }


  postOrUpdate(body:EmailViewModel ) {
   
     return this._apiService.post(`/SendEmailToClientsEndPoint/Post`, body)
  }
  
 

}
