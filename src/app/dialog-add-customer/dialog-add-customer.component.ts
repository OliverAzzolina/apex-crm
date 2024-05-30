import { Component, Inject, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Customer } from '../../models/customer.class';
import { DatabaseService } from '../services/database.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from '../../models/user.class';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-add-customer',
  standalone: true,
  imports: [    CommonModule, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, 
    FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatProgressBarModule, FormsModule, 
    ReactiveFormsModule, TranslateModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    provideNativeDateAdapter()],
  templateUrl: './dialog-add-customer.component.html',
  styleUrl: './dialog-add-customer.component.scss'
})

export class DialogAddCustomerComponent {
  customer: Customer = new Customer();
  birthDate: Date;
  customerData: any;
  loading: boolean = false;
  language:string;
  userId:string;
  user: User;

  firstNameFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  lastNameFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  birthdateFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  phoneFormControl = new FormControl('', [Validators.required, Validators.minLength(7)]);
  streetFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  numberFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  zipCodeFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  cityFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

  constructor(
    private database: DatabaseService, 
    public db: Firestore,
    public dialogRef: MatDialogRef<DialogAddCustomerComponent>,
    private _bottomSheet: MatBottomSheet,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ){};

  sheetService = inject(BottomSheetService);
  translate = inject(TranslateService);

  async ngOnInit(){
    await this.getUserId()
    await this.getUserData('users');
  }

  async getUserId(){
    this.userId = localStorage.getItem('User') as string;
  };

  async getUserData(users:string){
    onSnapshot(doc(this.db, users, this.userId), (doc) => {
      this.user = new User(doc.data());
      this.checkCalendarLanguage(this.user.translation) 
  })
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
    this.customer.birthDate = this.birthDate.getTime();
    const customerData = this.customer.toJSON();
    this.loading = true;
    await this.database.saveCustomer(customerData).then((result: any) => {
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
