import { Component } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Customer } from '../../models/customer.class';

import { DatabaseService } from '../services/database.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-dialog-edit-customer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, 
    FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatProgressBarModule],
  templateUrl: './dialog-edit-customer.component.html',
  styleUrl: './dialog-edit-customer.component.scss'
})
export class DialogEditCustomerComponent {
  loading: boolean = false;
  customer: Customer;
  birthDate: Date;
  birthdate:Date;
  id:string;
  
  
  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogEditCustomerComponent>){};
  
  private convertToDate(birthDate: number){
    return new Date(birthDate);
  };
  
  ngOnInit(){
    this.birthdate = this.convertToDate(this.customer.birthDate);
  }
  
  
  async saveCustomer() {
    this.customer.birthDate = this.birthdate.getTime();
    const customerData = this.customer.toJSON();
    this.loading = true;
    await this.database.saveEditedCustomer(customerData, this.id).then((result: any) => {
      console.log('updated Customer', result);
      this.loading = false;
      this.dialogRef.close();
    });
  }
}
