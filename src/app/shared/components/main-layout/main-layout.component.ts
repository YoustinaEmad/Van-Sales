import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebsiteService } from 'src/app/features/website/services/website.service';
import { LocalizationService } from '../../service/localization.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  currentLang = 'en';
  showLangOptions: boolean = false;

  constructor(private router: Router, public websiteService: WebsiteService, private translate: TranslateService, private localizationService: LocalizationService, @Inject(DOCUMENT) private document: Document
  ) { this.currentLang = this.localizationService.getLanguage(); }
  ngOnInit() {
    this.getUserName();
    this.getRoleIDFromToken();
    this.currentLang = this.localizationService.getLanguage();
    // this.setDirection(this.currentLang);
  }

  @ViewChild('langButton', { static: false }) langButton!: ElementRef;
@ViewChild('langDropdown', { static: false }) langDropdown!: ElementRef;
@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement;

  const clickedInsideButton = this.langButton?.nativeElement.contains(target);
  const clickedInsideDropdown = this.langDropdown?.nativeElement.contains(target);

  if (!clickedInsideButton && !clickedInsideDropdown) {
    this.showLangOptions = false;
  }
}

  RolesEnum = [
    { id: 1, name: 'SuperAdmin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Company' },
    { id: 4, name: 'Client' },
  ];
  userName = '';
  userRole = '';
  signOut() {
    localStorage.clear();
    this.router.navigate(['/auth/login'])
  }
  shopHome() {
    this.router.navigate(['/tahwesha/home'])

  }

  getUserName() {
    this.websiteService.userLoading = true
    this.websiteService.getUserInfo().subscribe((res) => {
      if (res.isSuccess) {
        this.userName = res.data.name;
        this.websiteService.userInfo = res.data
        this.websiteService.userLoading = false
      }
    })
  }


  getRoleIDFromToken(): string | null {
    const token = localStorage.getItem('eToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.RoleID;
      return payload.RoleID;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }


  

  toggleLangOptions(): void {
    this.showLangOptions = !this.showLangOptions; // Toggle dropdown visibility
  }

  changeLang(lang: string): void {
    this.localizationService.setLanguage(lang); // ده بيعمل translate.use(lang)
    this.currentLang = lang;
    this.setDirection(lang);
    this.showLangOptions = false;
    window.location.reload(); // 👈 reload بعد تغيير اللغة

  }
  setDirection(lang: string): void {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.dir = dir;
    this.document.documentElement.lang = lang;
  }
  

}
