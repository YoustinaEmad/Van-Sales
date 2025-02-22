import { Component, OnDestroy, OnInit } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { EmailViewModel } from '../../interface/email-view-model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { EmailService } from '../../service/email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: EmailViewModel = new EmailViewModel();
  id: string;
  constructor(
    private _sharedService: SharedService,
    private _emailService: EmailService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });
   this.createForm();
  }
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      subject: [this.item.subject, Validators.required],
      body: [this.item.body, Validators.required],
      toEmails: [this.item.toEmails || [], 
      {
        validators: [Validators.required, this.emailListValidator()],
        updateOn: 'blur', 
      }
    ],    });
    this.page.isPageLoaded = true;
  }

  emailListValidator(): ValidatorFn {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; 
  
    return (control: AbstractControl): ValidationErrors | null => {
      const emails = control.value;
  
      if (!emails || emails.length === 0) {
        return null; // Return null for no errors if list is empty
      }
  
      const invalidEmails = emails.filter(
        (email: string) => !emailRegex.test(email.trim())
      );
  
      return invalidEmails.length > 0
        ? { invalidEmails: { value: invalidEmails } }
        : null;
    };
  }
  
  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this._emailService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isSaving = false;
      },
    });
  }

  onCancel(): void {
    //this._router.navigate(['/sites/category']);
  }

  onReset() {
    this.page.form.reset();
    
  }
  ngOnDestroy(): void {}


}
