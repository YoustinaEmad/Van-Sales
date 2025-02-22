import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { ControlType } from '../../models/enum/control-type.enum';
@Component({
  selector: 'ng-control',
  templateUrl: './ng-control.component.html',
})
export class NgControlComponent implements OnInit, OnChanges {
  @Input() form!: UntypedFormGroup
  @Input() formClass: string = ''
  @Input() control!: string
  @Input() type: ControlType = ControlType.INPUT_TEXT
  @Input() value: boolean;
  @Input() label!: string
  @Input() inputClass: string = ''
  @Input() labelClass: string = ''
  @Input() descClass: string = ''
  @Input() placeholder: string = ''
  @Input() bindValue: string = 'id'
  @Input() bindLabel: string = 'name'
  @Input() bsConfig: object = { dateInputFormat: 'YYYY-MM - DD',showClearButton: false, clearPosition: 'right' ,adaptivePosition: true }
  @Input() searchFn
  @Input() filterValue: any
  @Input() filterProp: string
  @Input() endPlacholder: string = ''
  @Input() startPlaceholder: string = ''
  @Input() inputPlaceholderClass: string = ''
  @Input() diasblePastDate: boolean = false;
  @Input() labelIcon: string = ''
  @Input() labelImg: string = ''
  @Input() labelImgClass: string = ''
  @Input() readOnly: boolean = false
  @Input() annotationTitle: string = '';
  @Input() trigger: string = 'click';
  @Input() items: any[]
  @Input() desc: string = ''
  @Input() statusColor: string = ''
  @Input() clearable: boolean = true
  @Input() hideSelected: boolean = false
  @Input() multiple: boolean = false
  @Input() templete: any
  @Input() notFoundTemplete: any
  @Input() initialValue: any
  @Input() keyword: string = "Name"
  @Input() placement: string = "bottom"
  @Input() notFoundText: string
  @Input() minDate: Date = new Date()

  @Input() customFilter
  @Input() showClearButton: boolean = false
  @Output() change = new EventEmitter<any>();
  @Output() inputCleared = new EventEmitter<any>();
  @Output() inputChanged = new EventEmitter<any>();
  @Output() inputSelected = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  controlType = ControlType
  @Output() keyup = new EventEmitter<any>();
  passwordVisible: boolean = false;
  constructor() {
  }
  ngOnInit(): void {
    if (!this.diasblePastDate) {
      this.minDate.setFullYear(2000)
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['showClearButton']?.currentValue) {
      this.bsConfig = { ...this.bsConfig, showClearButton: this.showClearButton }
    }
  }
  isControlNotValidAndTouched() {
    let control = this.form.controls[this.control];
    if (control)
      return control.invalid && control.touched;
    else
      console.log(`Control Filed : ${this.control}`);;
    return false;
  }
  isControlValidAndDirty() {
    let control = this.form.controls[this.control];
    if (control)
      return control.valid && control.dirty;
    else
      console.log(`Control Filed : ${this.control}`);;
    return false;
  }
  isControlNotValidAndDirty() {
    let control = this.form.controls[this.control];
    if (control) {
      return !control.valid && control.dirty;
    } else {
      console.log(`Control Filed : ${this.control}`);
      return false;
    }
  }
  isControlHasError(error: string) {
    return this.form.controls[this.control].hasError(error);
  }
  isEmail() {
    return this.control == 'Email';
  }
  isDate() {
    return this.control == 'FromDate' || this.control == 'ToDate';
  }
  isMobile() {
    return this.control == 'Mobile';
  }
  isUserName() {
    return this.control == 'Username';
  }
  isPassword() {
    return this.control == 'Password';
  }
  isNationalID() {
    return this.control === 'NationalID'
  }
  isNameAraibic() {
    return this.control === 'NameArabic'
  }
  validator() {
    if (this.form.get(this.control).validator != null) {
      const validator = this.form.get(this.control).validator({} as AbstractControl);
      if (validator && validator['required']) {
        return true;
      }
    }
    return false
  }
  onChange(event) {
    return this.change.emit(event)
  }
  onKeyup(value) {
    this.keyup.emit(value)
  }
  onblur(event?) {    
    if(event)
      this.blur.emit(event)
    else
      this.blur.emit()
  }
  onInputCleared() {
    this.inputCleared.emit()
  }
  onInputChanged(value) {
    this.inputChanged.emit(value)
  }
  onSelected(item) {
    this.inputSelected.emit(item)
  }
  isDisabled(): boolean {
    return this.form.get(this.control).disabled
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
