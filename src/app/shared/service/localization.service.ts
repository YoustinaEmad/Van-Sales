import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  appLangDefault: string = 'en';
  savelangLocalStorageKey: string = 'lang'
  constructor(private translate: TranslateService) { }
  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem(this.savelangLocalStorageKey, lang.toLowerCase());
  }
  hasLanguage() {
    let lang = localStorage.getItem(this.savelangLocalStorageKey);
    return (lang != null && lang.length > 0 && lang != 'undefined')
  }
  getLanguage(): string {
    // get browser language
    const browserLang = this.translate.getBrowserLang();
    // get the saved language from localStorage if set
    const savedLang = localStorage.getItem(this.savelangLocalStorageKey);
    // check if a language is saved
    if (savedLang) {
      return savedLang;
    } else if (browserLang && browserLang.match(/en|ar/)) {
      return browserLang;
    } else {
      return this.appLangDefault;
    }
  }
  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }
  get IsEnglish() {
    return this.translate.currentLang == this.appLangDefault
  }
}
