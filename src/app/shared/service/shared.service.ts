import { EventEmitter, Injectable, Output, } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DateService } from './date.service';
import { LogService } from './log.service';
import { TokenService } from './token.service';
import { LocalizationService } from './localization.service';
import { PageOptions } from '../models/page-options.model';
import { SaveFilterationViewModel } from '../models/save-filteration.model';
import { ResponseViewModel } from '../models/response.model';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { UserPagesViewModel } from '../models/logged-user.model';

import { ScreenSize } from '../models/enum/screen-size';
import { FeatureEnum } from '../models/enum/feature.enum';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationRole } from '../models/enum/application-role';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private showAlertPopUpSource = new BehaviorSubject<boolean>(false);
  showAlertPopUp$ = this.showAlertPopUpSource.asObservable();
  setShowAlertPopUp(value: boolean) {
    this.showAlertPopUpSource.next(value);
  }



  static featureList: FeatureEnum[] = [];
  static pageList: UserPagesViewModel[] = [];
  static childPagesList: UserPagesViewModel[] = [];
  static PageTree: UserPagesViewModel = new UserPagesViewModel();
  @Output() parentChildEvent = new EventEmitter<{ isReuest?: any; fromParent: boolean, data: any }>();
  fireEvent(fromParent: boolean, data?: any) {
    this.parentChildEvent.emit({ fromParent: fromParent, data: data, });
  }
  hubSubject: BehaviorSubject<object> = new BehaviorSubject<object>(null);

  constructor(
    public formBuilder: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    public dateService: DateService,
    public _logService: LogService,
    private tokenService: TokenService,
    public _localizationService: LocalizationService,
    public _storageService: StorageService,
    public modalService: BsModalService,


  ) {

  }


  back() {
    history.back();
  }
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value);
  }
  isImage(value: string): boolean {
    return !value.includes('uil');
  }
  getCurrentRoute(): string {
    return this.router.url.split('?')[0];
  }
  getRouteList(): string[] {
    return this.getCurrentRoute().split('/').filter(i => i != '');
  }
  getPageList(pageList: UserPagesViewModel[]): UserPagesViewModel[] {
    return pageList.map(i => { return { ...i, IsImage: this.isImage(i.Icon) }; });
  }
  getPageByID(id: number) {
    return SharedService.pageList.find(i => i.ID == id);
  }
  getPageDefaultRoute(id: number): string {


    return SharedService.pageList.some(i => i.ParentPageID == id) ? this.getPageDefaultRoute(this.getFirstChild(id).ID) : SharedService.pageList.find(i => i.ID == id).Url;
  }
  getFirstChild(id: number) {
    const order = Math.min(...SharedService.pageList.filter(i => i.ParentPageID == id).map(i => i.DisplayOrder));
    return SharedService.pageList.filter(i => i.ParentPageID == id).find(i => i.DisplayOrder == order);
  }
  getChildList(id: number): UserPagesViewModel[] {
    return SharedService.pageList.filter(i => i.ParentPageID == id);
  }
  getFirstLayoutCurrentChild(id: number): UserPagesViewModel {
    const routeList = this.getRouteList();
    return this.getChildList(id).find(i => i.Url == '/' + routeList[0] + '/' + routeList[1]
      && !routeList.includes('create') && !routeList.includes('details') && !routeList.includes('leader-board') && routeList.every(i => isNaN(+i)));
  }
  getLastLayoutCurrentChild(id: number): UserPagesViewModel {
    return this.getChildList(id).find(i => i.Url == this.getCurrentRoute());
  }

  getThirdLayoutCurrentChild(id: number): UserPagesViewModel {
    const routeList = this.getRouteList();
    return this.getChildList(id).find(i => i.Url == '/' + routeList[0] + '/' + routeList[1] + '/' + routeList[2]
      && !routeList.includes('create') && !routeList.includes('details') && !routeList.includes('leader-board') && routeList.every(i => isNaN(+i)));
  }
  isShowLayout() {
    const routeList = this.getRouteList();
    return !routeList.includes('edit') && !routeList.includes('create') && !routeList.includes('details');
  }
  showFirstLayout(id: number): boolean {
    return this.getChildList(id).some(i => i.ID == this.getFirstLayoutCurrentChild(id)?.ID) && this.getChildList(id).length > 1;
  }
  showLastLayout(id: number): boolean {
    return this.getChildList(id).some(i => i.ID == this.getFirstLayoutCurrentChild(id)?.ID);// && this.getChildList(id).length>1
  }

  addHours(datetime: string, hours: number): string {
    const date = new Date(datetime);
    date.setHours(date.getHours() + hours);
    return date.toISOString();
  }


  isDevMode(): boolean {
    return !environment.production;
  }
  getScreenSize(): ScreenSize {
    const windowSize = window.innerWidth;
    if (windowSize >= 1400)
      return ScreenSize.XXL;
    else if (windowSize >= 1200 && windowSize < 1400)
      return ScreenSize.XL;
    else if (windowSize >= 992 && windowSize < 1200)
      return ScreenSize.LG;
    else if (windowSize >= 768 && windowSize < 992)
      return ScreenSize.MD;
    else if (windowSize >= 576 && windowSize < 768)
      return ScreenSize.SM;
    else
      return ScreenSize.XS;
  }
  isMobileView(): boolean {
    return this.getScreenSize() == ScreenSize.XS;
  }

  isObjectChanged(a, b): boolean {
    for (const key in a) {
      if (a[key] != b[key]) return true;
    }
    return false;
  }
  getSumValues(list: any[]): number {
    return list.reduce((acc, cur) => acc + cur, 0);
  }
  getCurrentMoudleName(): string {
    return this.router.url.split('?')[0].split('/')[1];
  }
  getCurrenPageName(): string {
    return this.router.url.split('?')[0].split('/')[2]?.split('?')[0];
  }
  showToastr(response: ResponseViewModel) {
    if (response.isSuccess || response.Success || response.IsSuccess) {
      this.toastr.success('', response.message, {
        toastClass: 'successToastClass',
      });
    } else {
      this.toastr.error('', response.message, {
        toastClass: 'errorToastClass',
      });
    }
  }
  showErrorAlert(message: string) {
    this.toastr.error('', message, {
      toastClass: 'errorToastClass',
    });
  }
  showSuccessAlert(message: string) {
    this.toastr.success('', message, {
      toastClass: 'successToastClass',
    });
  }
  logOut() {
    this.tokenService.clearUserData();
    this._storageService.removeUserPages();
    this._storageService.removeISSingleStore();
    this._storageService.removeApi();
    this._storageService.removeRedirectUrl()
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  isLTR(): boolean {
    return this._localizationService.getLanguage() != 'ar';
  }

  getFilterationFromURL(params: any, searchForm: UntypedFormGroup, pageSort?: PageOptions, takeToDateValue: boolean = false) {
    if (Object.keys(params).length > 0) {
      for (const key in params) {
        if (key == 'orderBy' || key == 'isAscending') {
          if (pageSort) {
            pageSort.orderBy = params['orderBy'];
            pageSort.isAscending = params['isAscending'];
          }
        }
        else if (key == 'ToDate' || key == 'FromDate' || key == 'Date' || key == 'to' || key == 'from' || key.includes('Date')) {
          searchForm.get(key).setValue(new Date(params[key]));
        }
        else if (key == 'currentPage') {
          pageSort.currentPage = +params['currentPage'];
        }
        else if (key == 'pageSize') {
          pageSort.pageSize = +params['pageSize'];
        }
        else if (!isNaN(params[key]) && searchForm.get(key) != null && (!params[key].startsWith('0') || params[key] == 0)) {
          searchForm.get(key).setValue(+params[key]);
        }
        else if (searchForm.get(key)) {
          searchForm.get(key).setValue(params[key]);
        }
      }
    }
    else {
      for (const key in searchForm.controls) {
        const value = searchForm.get(key).value;
        if (key == 'ToDate') {
          if (takeToDateValue) searchForm.get(key).setValue(value);
          else searchForm.get(key).setValue(new Date());
        }
        else if (key == 'FromDate') searchForm.get(key).setValue(value);
        // else if (key == 'FromDeliverDate') searchForm.get(key).setValue(value);
        else if (key == 'Date') searchForm.get(key).setValue(new Date());
        else searchForm.get(key).setValue(null);
      }
    }
  }
  saveFilteration(model: SaveFilterationViewModel) {
    const params = {};
    if (model.searchForm) {
      for (const key in model.searchForm.controls) {
        const value = model.searchForm.get(key).value;
        if (value != null && value != '') {
          if (key == 'ToDate' || key == 'FromDate' || key == 'Date' || key == 'from' || key == 'to' || key.includes('Date'))
            params[key] = moment(value).format('YYYY-MM-DD');
          else params[key] = value;
        }
      }
    }
    params['orderBy'] = model.orderBy;
    params['isAscending'] = model.isAscending;
    // params['pageSize'] = model.pageSize,
    // params['currentPage'] = model.currentPage,
    params['key'] = (Math.random() * 1000).toString();
    this.router.navigate([model.pageRoute], { queryParams: params });
  }
  saveFilterationNgModel(pageRoute: string, searchForm: any[] = []) {
    const params = {};
    searchForm.forEach((element) => {
      if (element.key == 'ToDate' || element.key == 'FromDate')
        params[element.key] = moment(element.value).format('YYYY-MM-DD');
      else params[element.key] = element.value;
    });
    params['key'] = (Math.random() * 1000).toString();
    this.router.navigate([pageRoute], { queryParams: params });
    this.router.navigate([pageRoute], { queryParams: params });
  }
  getFilterationURLNgModel(params: any, searchForm: any[] = []) {
    for (const key in params) {
      if (key == 'ToDate' || key == 'FromDate')
        searchForm.find((i) => i.key == key).value = new Date(params[key]);
      else if (!isNaN(params[key])) {
        searchForm.find((i) => i.key == key).value = +params[key];
      }
      // else if(!params[key]){
      //   // console.log(key,params[key]);
      //   searchForm.find(i => i.key == key).value = null
      // }
      else searchForm.find((i) => i.key == key).value = params[key];
    }
  }
  getDomainName(): string {
    return window.location.href.split('://')[1].split('/')[0];
  }

  sortBy = (function () {
    const toString = Object.prototype.toString,
      // default parser function
      parse = function (x) { return x; },
      // gets the item to be sorted
      getItem = function (x) {
        const isObject = x != null && typeof x === 'object';
        const isProp = isObject && this.prop in x;
        return this.parser(isProp ? x[this.prop] : x);
      };
    return function sortby(array, prop) {
      if (!(array instanceof Array && array.length)) return [];
      if (toString.call(prop) !== '[object Object]') prop = {};
      if (typeof prop.parser !== 'function') prop.parser = parse;
      prop.desc = prop.desc ? -1 : 1;
      return array.sort(function (a, b) {
        a = getItem.call(prop, a);
        b = getItem.call(prop, b);
        return prop.desc * (a < b ? -1 : +(a > b));
      });
    };
  }());


  downloadFile(data, fileName: string) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = fileName + ' ' + new Date().toLocaleDateString() + ' .xls';
    anchor.href = url;
    anchor.click();
  }



  uniqBySetWithSpread<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    if (charCode >= 48 && charCode <= 57) return true;

    if (charStr === '.' && event.target.value.indexOf('.') === -1) return true;

    return false;
  }

  characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))
      return false;
    return true;
  }




}
