import { Injectable } from '@angular/core';
// import * as CryptoJS from 'crypto-js';
import * as CryptoJS from 'crypto-js'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(
    private router: Router,
  ) { }

  // Generate a secret key based on token and role
  private generateSecretKey(token: string, role: number): string {
    const combined = `${token}:${role}`;
    return CryptoJS.SHA256(combined).toString(CryptoJS.enc.Hex);
  }

  // Encrypt the data using the generated secret key
  encryptData(data: string, token: string, role: number): string  {
    try {
      const secretKey = this.generateSecretKey(token, role);
      return CryptoJS.AES.encrypt(data, secretKey).toString();
    } catch (e) {
      console.error('Error encrypting data', e);
      return null;
    }
  }

  // Decrypt the data using the generated secret key
  decryptData(data: string, token: string, role: number): string{
    try {
      const secretKey = this.generateSecretKey(token, role);
      const bytes = CryptoJS.AES.decrypt(data, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      this.router.navigate(['/not-authorized']);
      // console.error('Error decrypting data', e);
      return null;
    }
  }
}
