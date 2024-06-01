import { Component, Inject, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Customer } from '../../models/customer.class';
import { DatabaseService } from '../services/database.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common'
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-dialog-edit-customer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, 
    FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatProgressBarModule, ReactiveFormsModule,
    TranslateModule
  ],
    providers: [
      {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
      provideNativeDateAdapter()
    ],
  templateUrl: './dialog-edit-customer.component.html',
  styleUrl: './dialog-edit-customer.component.scss'
})

export class DialogEditCustomerComponent {
  loading: boolean = false;
  customer: Customer;
  birthdate:Date;
  id:string;
  userId:string;
  user:User;
  
  birthDate: string;
  birth:string
  firstname = new FormControl('', [Validators.required, Validators.minLength(2)]);
  lastname = new FormControl('', [Validators.required, Validators.minLength(2)]);
  dateOfBirth = new FormControl('', [Validators.required, Validators.minLength(1)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', [Validators.required, Validators.minLength(7)]);
  street = new FormControl('', [Validators.required, Validators.minLength(2)]);
  number = new FormControl('', [Validators.required, Validators.minLength(1)]);
  zipCode = new FormControl('', [Validators.required, Validators.minLength(1)]);
  city = new FormControl('', [Validators.required, Validators.minLength(1)]);

  constructor(
    private database: DatabaseService, 
    public dialogRef: MatDialogRef<DialogEditCustomerComponent>, 
    private _bottomSheet: MatBottomSheet,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ){};
    
  sheetService = inject(BottomSheetService);
  translate = inject(TranslateService);

  private convertToDate(birthDate: number){
    return new Date(birthDate);
  };
  
  async ngOnInit(){
    await this.getUserId()
    this.birthdate = this.convertToDate(this.customer.birthDate);
    this.firstname.setValue(this.customer.firstName)
    this.lastname.setValue(this.customer.lastName)
    this.email.setValue(this.customer.email)
    this.phone.setValue(this.customer.phone)
    this.street.setValue(this.customer.street)
    this.number.setValue(this.customer.number)
    this.zipCode.setValue(this.customer.zipCode)
    this.city.setValue(this.customer.city)
  };

  async getUserId(){
    const data = JSON.parse(localStorage.getItem("loggedUserData") || '{}');
    this.checkCalendarLanguage(data.translation);
  };

  async checkCalendarLanguage(translateDatePicker: boolean){
    if(translateDatePicker){
      this._locale = 'de-DE'
    }else{
      this._locale = 'en-EN'
    }
    this._adapter.setLocale(this._locale);
  }
  
  async saveCustomer() {
    if(this.dateOfBirth.value){
      const birth = this.dateOfBirth.value!;
      const birthDate = new Date(birth)
      this.customer.birthDate = birthDate.getTime();
      this.customer.birthdate = birthDate.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'numeric', year: 'numeric'
      }).replaceAll('/', '.');
    }else{
      const birthDate = new Date(this.customer.birthDate);
      this.customer.birthDate = birthDate.getTime();
      this.customer.birthdate = birthDate.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'numeric', year: 'numeric'
      }).replaceAll('/', '.');
    }
    this.customer.firstName = this.firstname.value!;
    this.customer.lastName = this.lastname.value!;
    this.customer.email = this.email.value!;
    this.customer.phone = this.phone.value!;
    this.customer.street = this.street.value!;
    this.customer.number = this.number.value!;
    this.customer.zipCode = this.zipCode.value!;
    this.customer.city = this.city.value!;
    const customerData = this.customer.toJSON();
    this.loading = true;
    await this.database.saveEditedCustomer(customerData, this.id).then((result: any) => {
      console.log('updated Customer', result);
      this.loading = false;
      this.dialogRef.close();
      this.openBottomSheet();
    });
  };

  openBottomSheet(){
    this.sheetService.message = "sheet.customer-save";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
}
