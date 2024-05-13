import { Component, Input, ViewChild, forwardRef } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { doc, onSnapshot } from "firebase/firestore";
import { Firestore, docData } from '@angular/fire/firestore';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSort } from '@angular/material/sort';
import { Task } from '../../models/task.class';
import { collection, query, where, getDocs } from "firebase/firestore";
import { CommonModule } from '@angular/common';
import { DialogEditTaskComponent } from '../dialog-edit-task/dialog-edit-task.component';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';
import { Purchase } from '../../models/purchase.class';
import { DialogAddPurchaseComponent } from '../dialog-add-purchase/dialog-add-purchase.component';
import { DialogEditPurchaseComponent } from '../dialog-edit-purchase/dialog-edit-purchase.component';
import { SetTabIndexService } from '../services/set-tab-index.service';
import {FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CustomersComponent } from '../customers/customers.component';
import { Customer } from '../../models/customer.class';
import { DialogEditCustomerComponent } from '../dialog-edit-customer/dialog-edit-customer.component';
import { DialogDeleteCustomerComponent } from '../dialog-delete-customer/dialog-delete-customer.component';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [MatCardModule, CommonModule, CustomersComponent, MatIconModule, MatButtonModule, MatTooltipModule, MatTabsModule, MatMenuModule, 
    MatTableModule, MatFormField, MatLabel, MatCheckboxModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent {
  constructor(private router: Router, public db: Firestore, public dialog: MatDialog, public tabIndex: SetTabIndexService ) {}

  id: string;
  customerData: any;
  taskData: any;
  allTasks: any[] = [];
  allPurchases: any = [];
  customer: Customer = new Customer();
  task: Task = new Task();
  purchase: Purchase = new Purchase();
  birthdate: Date;
  actualTabIndex:any = 0;
  selectedTabIndex = new FormControl( this.actualTabIndex);
 
  ngOnInit(){
    this.id = this.router.url.split('/').splice(3, 1).toString();
    this.getCustomerData();
    this.getTasks();
    this.setNewTabIndex()
    this.getPurchases();
    console.log()
  }

  setNewTabIndex(){
    this.actualTabIndex = this.tabIndex.tabIndex;
    this.selectedTabIndex = new FormControl( this.actualTabIndex);
  }

  getCustomerData(){
    onSnapshot(doc(this.db, "customers", this.id), (doc) => {
          this.customer = new Customer(doc.data());
          this.birthdate = this.convertToDate(this.customer.birthDate);
          this.customer.birthdate = this.birthdate.toString().split(" ").splice(1,3).join(" ");
    });
  };

  private convertToDate(birthDate: number){
    return new Date(birthDate);
  };

  openDialogEditCustomer(){
   let dialog = this.dialog.open(DialogEditCustomerComponent);
   dialog.componentInstance.customer = new Customer(this.customer);
   dialog.componentInstance.id = this.id;
  }

  openDialogDeleteCustomer(){
    let dialog = this.dialog.open(DialogDeleteCustomerComponent);
    dialog.componentInstance.id = this.id;
  }

  //TASKS TABLE
  async getTasks(){
    const tasksRef = collection(this.db, "tasks");
    const q = query(tasksRef, where('customerId', "==", this.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    this.allTasks= [];
    querySnapshot.forEach((doc:any) => {
      this.task = new Task(doc.data());
      this.task.taskId = doc.id;
      this.allTasks.push(this.task);
    });
  })}

    openDialogAddTask(){
      let dialog = this.dialog.open(DialogAddTaskComponent);
      dialog.componentInstance.customerId = this.id;
      dialog.componentInstance.customerName = this.customer.firstName + ' ' + this.customer.lastName;
      console.log(this.customer.firstName + ' ' + this.customer.lastName)
    }

    openDialogEditTask(task:any){
      let dialog = this.dialog.open(DialogEditTaskComponent);
      dialog.componentInstance.task = new Task(task);
      dialog.componentInstance.taskId = task.taskId;
      dialog.componentInstance.customerId = this.id;
    }
    
  //PURCHASES TABLE
  async getPurchases(){
    const purchasesRef = collection(this.db, "purchases");
    const q = query(purchasesRef, where('customerId', "==", this.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    this.allPurchases= [];
    querySnapshot.forEach((doc:any) => {
      this.purchase = new Purchase(doc.data());
      this.purchase.purchaseId = doc.id;
      this.allPurchases.push(this.purchase);
    });
  })}

  openDialogAddPurchase(){
    let dialog = this.dialog.open(DialogAddPurchaseComponent);
    dialog.componentInstance.customerId = this.id;
  }

  openDialogEditPurchase(purchase: any){
    let dialog = this.dialog.open(DialogEditPurchaseComponent);
    dialog.componentInstance.purchase = new Purchase(purchase);
    dialog.componentInstance.purchaseId = purchase.purchaseId;
    dialog.componentInstance.customerId = this.id;
  }
}
