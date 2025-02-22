import { throwError as observableThrowError, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LocalizationService } from './localization.service';
import { ResponseViewModel } from '../models/response.model';
import { LogService } from './log.service';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected apiUrl: string | null

  constructor(
    protected tokenService: TokenService,
    protected http: HttpClient,
    protected localizationService: LocalizationService,
    protected _alertService: AlertService,
    protected _logService: LogService,
    protected _router: Router,
    protected _sharedService: SharedService
  ) { }


  getApiUrl() {
    this.apiUrl = environment.api
  }

  // Request options
  private setHeaders(withFiles: boolean = false): HttpHeaders {
    let headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      lang: this.localizationService.getLanguage(),
      //Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjBhMDZlZjc4LTE4NzMtNDE4OS1hZmE0LWU2NjM2NWIzNDVlYSIsIlJvbGVJRCI6IkNsaWVudCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiMDEwOTQ4MDQ3MDUiLCJuYmYiOjE3MzczNjE5MjEsImV4cCI6MTczNzk2NjcyMSwiaWF0IjoxNzM3MzYxOTIxLCJpc3MiOiJLT0cuRUNvbW1lcmNlIiwiYXVkIjoiS09HLkVDb21tZXJjZS1Vc2VycyJ9.uMcDlePS7yMjWAKnHiPCBnshinBX42QlNoser2nF2Qc',
      Authorization:  this.tokenService.getToken(),


    }

    let headersConfigWithImage = {
      Accept: 'application/json',
      lang: this.localizationService.getLanguage(),

      //Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjBhMDZlZjc4LTE4NzMtNDE4OS1hZmE0LWU2NjM2NWIzNDVlYSIsIlJvbGVJRCI6IkNsaWVudCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiMDEwOTQ4MDQ3MDUiLCJuYmYiOjE3MzczNjE5MjEsImV4cCI6MTczNzk2NjcyMSwiaWF0IjoxNzM3MzYxOTIxLCJpc3MiOiJLT0cuRUNvbW1lcmNlIiwiYXVkIjoiS09HLkVDb21tZXJjZS1Vc2VycyJ9.uMcDlePS7yMjWAKnHiPCBnshinBX42QlNoser2nF2Qc',
      Authorization:this.tokenService.getToken(),
    };
    if (withFiles) return new HttpHeaders(headersConfigWithImage);
    else return new HttpHeaders(headersConfig);

  }

  private formatErrors(error: any) {
    if (error.status == 401) {
      // this._sharedService.logOut()
      this._router.navigate(['/not-authorized']);
      // this._router.navigate(['/login']);
    } else if (error.status == 500) {
      this._alertService.error('حدث خطأ من فضلك حاول لاحقاً');
    } else if (error.status == 404) {
      this._alertService.error('حدث خطأ من فضلك حاول لاحقاً');
    }
    this._logService.addToConsole(error);
    return observableThrowError(error);
  }

  // GET request method
  get(path: string, params?: HttpParams): Observable<ResponseViewModel> {
    this.getApiUrl();
    return this.http.get<ResponseViewModel>(`${this.apiUrl}${path}`, { headers: this.setHeaders(), params }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: ResponseViewModel) => res)
    );
  }


  getExcel(path: string, params?: HttpParams): Observable<Blob> {
    this.getApiUrl();
    return this.http.get(`${this.apiUrl}${path}`, {
      headers: this.setHeaders(),
      params,
      responseType: 'blob', // Ensures the response is treated as a binary file
    }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: Blob) => res) // Map the response to a Blob
    );
  }
  

  // POST request method
  post(path: string, body: Object = {}, withFiles = false, withAuth: boolean = false): Observable<ResponseViewModel> {
    this.getApiUrl();
    return this.http.post<ResponseViewModel>(`${this.apiUrl}${path}`, body, { headers: this.setHeaders(withFiles) }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: ResponseViewModel) => res)
    );
  }

  // PUT request method for updating
  update(path: string, body: Object = {}, withFiles = false, withAuth: boolean = false): Observable<ResponseViewModel> {
    this.getApiUrl();
    return this.http.put<ResponseViewModel>(`${this.apiUrl}${path}`, body, { headers: this.setHeaders(withFiles) }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: ResponseViewModel) => res)
    );
  }

  // DELETE request method
  remove(path: string, body?: Object): Observable<ResponseViewModel> {
    this.getApiUrl();
    return this.http.delete<ResponseViewModel>(`${this.apiUrl}${path}`, { body, headers: this.setHeaders() }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: ResponseViewModel) => res)
    );
  }
  getImages(path: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${path}`, { responseType: 'blob' });
  }

  getFromGoogle(path: string) {
    return this.http.get(`${path}`);
  }

  getFiles(path: string, params?: HttpParams): Observable<Blob> {
    this.getApiUrl()
    return this.http.get(`${this.apiUrl}${path}`, {
      responseType: 'blob',
      headers: this.setHeaders(true),
      params,
    });
  }

  removeAttachment(path: string): Observable<ResponseViewModel> {
    this.getApiUrl()

    return this.http.get<ResponseViewModel>(`${this.apiUrl}${path}`, { headers: this.setHeaders() })
      .pipe(map((res: ResponseViewModel) => res));
  }

  postMedia(path: string, param: FormData, isMultipart: boolean): Observable<any> {
    this.getApiUrl();
  
    // 'isMultipart' flag is not necessary here unless you're doing specific header manipulations
    return this.http.post(`${this.apiUrl}${path}`, param).pipe(
      catchError(this.formatErrors),
      map((res: any) => res)
    );
  }
  


  
}
