import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dialog-delete-customer',
  standalone: true,
  imports: [MatDialogModule, MatCheckboxModule, CommonModule, FormsModule, MatButtonModule, RouterLink],
  templateUrl: './dialog-delete-customer.component.html',
  styleUrl: './dialog-delete-customer.component.scss'
})
export class DialogDeleteCustomerComponent {
  router: any;
  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeleteCustomerComponent>){};

id:string;
checked = false;


async deleteCustomer(){
  this.database.deleteSelectedCustomer(this.id).then((result:any) =>{
    console.log('deleted Customer with ID: ', this.id, result);
    this.dialogRef.close();
  })

}
}
