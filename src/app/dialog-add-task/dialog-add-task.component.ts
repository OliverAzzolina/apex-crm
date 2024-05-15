import { Component } from '@angular/core';
import { Task } from '../../models/task.class';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { Customer } from '../../models/customer.class';
import { RouterLink } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-add-task',
  standalone: true,
  imports: [ MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, 
    FormsModule, MatSelectModule, MatDialogActions, ReactiveFormsModule
  ],
  templateUrl: './dialog-add-task.component.html',
  styleUrl: './dialog-add-task.component.scss'
})
export class DialogAddTaskComponent {

  customerName:string;
  customerId: string;
  customer:any;
  task: Task = new Task();
  taskId: string;
  loading = false;
  taskData: any;
  selectedCustomer:any;
  selectedCustomerName:string;
  allCustomers:any = [];

  constructor(private database: DatabaseService, public db: Firestore, public dialogRef: MatDialogRef<DialogAddTaskComponent>){};

  customerFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  statusFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  noteFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

statusOpt: Status[] = [
  {value: 'open', viewValue: 'open'},
  {value: 'closed', viewValue: 'closed'},
];

async ngOnInit(){
  await this.loadAllCustomers();
  await this.checkForCustomerId();
}

async loadAllCustomers(){
  const querySnapshot = await getDocs(collection(this.db, "customers"));
  querySnapshot.forEach((doc) => {
    this.customer = doc.data();
    this.customer.customerId = doc.id;
    this.allCustomers.push(this.customer)
  });
}

async checkForCustomerId(){
  if(this.customerId){
    this.selectedCustomer = this.allCustomers.find( (cust: { customerId: string; }) => this.customerId == cust.customerId );
    this.selectedCustomerName = this.selectedCustomer.firstName + ' ' + this.selectedCustomer.lastName;
    console.log(this.selectedCustomerName)
  }
}

getCustomerId(customerId:string){
  this.customerId = customerId;
}

async saveTask() {
  
  const taskData = this.task.toJSON();
  taskData.customerId = this.customerId;
  taskData.customerName = this.selectedCustomerName;
  this.loading = true;
  await this.database.saveNewTask(taskData).then((result: any) => {
    console.log('added task', taskData);
    this.loading = false;
    this.dialogRef.close();
  });
}

async generateTaskId(){
  const id = "id" + Math.random().toString(16).slice(2);
  return id;
}
}
