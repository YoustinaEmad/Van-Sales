import { Injectable } from '@angular/core';
import { AppStorageKeys } from '../../core/constants/local-storage.constans';
import { ApplicationRole } from '../models/enum/application-role';
import { ApiAuth } from '../models/interfaces/auth.model';
import { CompanyType } from '../models/enum/compant-type.enum';
import { CryptoService } from './encryption.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(
    private _encryptService: CryptoService,
    private _tokenService: TokenService
  ) { }
  setUserPages(value: string) {
    const token = this._tokenService.getToken();
    const role = this._tokenService.getRole();
    const USER_PAGES = this._encryptService.encryptData(value, token, role);
    localStorage.setItem(AppStorageKeys.USER_PAGES_STORAGE_NAME, USER_PAGES);
  }
  getUserPages() {
    let value = localStorage.getItem(AppStorageKeys.USER_PAGES_STORAGE_NAME);
    const token = this._tokenService.getToken();
    const role = this._tokenService.getRole()

    if (value == null || value == 'undefined')
      return [];
    const USER_PAGES = this._encryptService.decryptData(value, token, role);
    return JSON.parse(USER_PAGES) as number[];
  }
  removeUserPages() {
    localStorage.setItem(AppStorageKeys.USER_PAGES_STORAGE_NAME, "");
    localStorage.removeItem(AppStorageKeys.USER_PAGES_STORAGE_NAME);
  }
  setRedirectUrl(value: string) {
    localStorage.setItem(AppStorageKeys.REDIRECT_URL, value);
  }
 
  getRedirectUrl(): string | null {
    const value = localStorage.getItem(AppStorageKeys.REDIRECT_URL);
    if (
      value === null ||
      value === undefined ||
      value.trim() === '' ||
      value === 'null' ||
      value === 'undefined'
    ) {
      return null;
    }
    const trimmedValue = value.trim();
    const regex = /^[a-zA-Z/][a-zA-Z0-9/_-]{0,99}$/;
    
    
    if (!regex.test(trimmedValue)) {
      return null;
    }
    return trimmedValue;
  }
  
  
  removeRedirectUrl() {
    localStorage.removeItem(AppStorageKeys.REDIRECT_URL);
  }

  setISSingleStore(value: string) {
    localStorage.setItem(AppStorageKeys.IS_SINGLE_STORE_STORAGE_NAME, value);
  }

  getISSingleStore() {
    let value = localStorage.getItem(AppStorageKeys.IS_SINGLE_STORE_STORAGE_NAME);
    if (value == null || value == 'undefined')
      return false;
    return JSON.parse(value) as boolean;
  }

  setISDeliveryProvider(value: CompanyType) {
    let isDeliveryProvider = (value == CompanyType.DeliveryProvider) ? true : false
    localStorage.setItem(AppStorageKeys.IS_DELIVERY_PROVIDER_Name, isDeliveryProvider.toString());
  }

  getISDeliveryProvider() {
    let value = localStorage.getItem(AppStorageKeys.IS_DELIVERY_PROVIDER_Name);
    if (value == null || value == 'undefined')
      return false;
    return JSON.parse(value) as boolean;
  }
  removeISSingleStore() {
    localStorage.setItem(AppStorageKeys.IS_SINGLE_STORE_STORAGE_NAME, "");
    localStorage.removeItem(AppStorageKeys.IS_SINGLE_STORE_STORAGE_NAME);
  }


  setApi(value: ApiAuth) {
    localStorage.setItem(AppStorageKeys.API_STORAGE_NAME, JSON.stringify(value));
  }
  getApi(): ApiAuth|null {
    let value = localStorage.getItem(AppStorageKeys.API_STORAGE_NAME);
    if (value == null)
      return null;
    return JSON.parse(value) as ApiAuth;
  }


  hasApi(): boolean {
    let api: ApiAuth|null = this.getApi();
    return api !== null && 
    api.dispatch != null && 
    api.dispatch !== 'undefined' && 
    api.analytics != null && 
    api.analytics !== 'undefined';
  }

  removeApi() {
    localStorage.setItem(AppStorageKeys.API_STORAGE_NAME, "");
    localStorage.removeItem(AppStorageKeys.API_STORAGE_NAME);
  }

  setIsAllowKPIs(value: string) {
    localStorage.setItem(AppStorageKeys.IS_ALLOW_APIS_STORAGE_NAME, value);
  }
  getIsAllowKPIs() {
    let value = localStorage.getItem(AppStorageKeys.IS_ALLOW_APIS_STORAGE_NAME);
    if (value == null || value == 'undefined')
      return true;
    return JSON.parse(value) as boolean;
  }
  removeIsAllowKPIs() {
    localStorage.setItem(AppStorageKeys.IS_ALLOW_APIS_STORAGE_NAME, "");
    localStorage.removeItem(AppStorageKeys.IS_ALLOW_APIS_STORAGE_NAME);
  }

  setIsAllowAvaliableHubs(value: string) {
    localStorage.setItem(AppStorageKeys.IS_ALLOW_AVAILABLE_HUBS_STORAGE_NAME, value);
  }
  getIsAllowAvaliableHubs() {
    let value = localStorage.getItem(AppStorageKeys.IS_ALLOW_AVAILABLE_HUBS_STORAGE_NAME);
    if (value == null || value == 'undefined')
      return true;
    return JSON.parse(value) as boolean;
  }

  setIsAllowShowReadyAndPausedTasks(value: string) {
    localStorage.setItem(AppStorageKeys.IS_ALLOW_SHOW_READY_PAUSED_TASKS_STORAGE_NAME, value);
  }
  getIsAllowShowReadyAndPausedTasks() {
    let value = localStorage.getItem(AppStorageKeys.IS_ALLOW_SHOW_READY_PAUSED_TASKS_STORAGE_NAME);
    if (value == null || value == 'undefined')
      return false;
    return JSON.parse(value) as boolean;
  }
  setIsAllowShowReadyAndTransitTasks(value: string) {
    localStorage.setItem(AppStorageKeys.IS_ALLOW_SHOW_READY_TRANSIT_TASKS_STORAGE_NAME, value);
  }
  getIsAllowShowReadyAndTransitTasks() {
    let value = localStorage.getItem(AppStorageKeys.IS_ALLOW_SHOW_READY_TRANSIT_TASKS_STORAGE_NAME);
    if (value == null || value == 'undefined')
      return false;
    return JSON.parse(value) as boolean;
  }

  setUserRole(value: ApplicationRole) {
    localStorage.setItem(AppStorageKeys.Role_STORAGE_NAME, JSON.stringify(value));
  }
//   getUserRole(): number | null {
//     const role = +localStorage.getItem(AppStorageKeys.Role_STORAGE_NAME);
//     return role || null;
// }
getUserRole(): number | null {
  const role= localStorage.getItem(AppStorageKeys.Role_STORAGE_NAME);
  if (role !== null) {
      return +role; 
  }
  return null; 
}


  setCurrency(value: string) {
    localStorage.setItem(AppStorageKeys.CURRENCY, value);
  }
  getCurrency(): string {
    const currency = localStorage.getItem(AppStorageKeys.CURRENCY);
    return currency || '$';
  }
  setIsStoreMangerDP(value: boolean) {
    localStorage.setItem(AppStorageKeys.IS_STORE_MANGER_DELIVERY_PROVIDER, value.toString());
  }
  getIsStoreMangerDP(): boolean {
    const isStoreMangerDP = localStorage.getItem(AppStorageKeys.IS_STORE_MANGER_DELIVERY_PROVIDER);
    if (isStoreMangerDP == null || isStoreMangerDP == 'undefined')
      return false;
    return JSON.parse(isStoreMangerDP) as boolean;
  }

}
