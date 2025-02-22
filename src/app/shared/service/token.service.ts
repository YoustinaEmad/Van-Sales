import { Injectable, Inject } from '@angular/core';
import { ApplicationRole } from '../models/enum/application-role';
import { AppStorageKeys } from '../../core/constants/local-storage.constans';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private readonly localStroageInject = Inject(StorageService)
  setToken(token: string) {
    localStorage.setItem(AppStorageKeys.TOKEN_STORAGE_NAME, token);
  }

  getToken(): string {
    const token =  'Bearer '+ localStorage.getItem(AppStorageKeys.TOKEN_STORAGE_NAME);
    return token || '';
  }

  hasAccessToken(): boolean {
    const token = this.getToken();
    return token.length > 0;
  }

  // getRole(): number {
  //   return JSON.parse(localStorage.getItem(AppStorageKeys.Role_STORAGE_NAME)) as number
  // }
  getRole(): number {
    const role = localStorage.getItem(AppStorageKeys.Role_STORAGE_NAME);
    return role ? JSON.parse(role) as number : 0; 
  }
  
  removeToken() {
    localStorage.removeItem(AppStorageKeys.TOKEN_STORAGE_NAME);
  }



  removeRole() {
    localStorage.removeItem(AppStorageKeys.Role_STORAGE_NAME);
  }

  clearUserData() {
    this.removeToken();
    this.removeRole();
  }

  isAuthenticated(): boolean {
    return this.hasAccessToken();
  }

  isAuthorized(role: ApplicationRole): boolean {
    const userRole = +this.localStroageInject.getUserRole();
    return !isNaN(userRole) && userRole === role;
  }



}
