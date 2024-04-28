import { Component, Input, ViewChild, forwardRef } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { UserComponent } from '../user/user.component';
import { doc, onSnapshot } from "firebase/firestore";
import { Firestore, docData } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';
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

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCardModule, CommonModule, UserComponent, MatIconModule, MatButtonModule, MatTooltipModule, MatTabsModule, MatMenuModule, 
    MatTableModule, MatFormField, MatLabel, MatCheckboxModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})

export class UserDetailComponent {
  
  constructor(private router: Router, public db: Firestore, public dialog: MatDialog, public tabIndex: SetTabIndexService ) {}

  id: string;
  userData: any;
  taskData: any;
  allTasks: any[] = [];
  allPurchases: any = [];
  user: User = new User();
  task: Task = new Task();
  purchase: Purchase = new Purchase();
  birthdate: Date;
  actualTabIndex:any = 0;
  selectedTabIndex = new FormControl( this.actualTabIndex);
 
  ngOnInit(){
    this.id = this.router.url.split('/').splice(2, 1).toString();
    console.log(this.id);
    this.getUserData();
    this.getTasks();
    this.setNewTabIndex()
    this.getPurchases();
  }

  setNewTabIndex(){
    this.actualTabIndex = this.tabIndex.tabIndex;
    console.log(this.actualTabIndex, this.tabIndex.tabIndex)
    this.selectedTabIndex = new FormControl( this.actualTabIndex);
  }

  getUserData(){
    onSnapshot(doc(this.db, "users", this.id), (doc) => {
          this.user = new User(doc.data());
          this.birthdate = this.convertToDate(this.user.birthDate);
          this.user.birthdate = this.birthdate.toString().split(" ").splice(1,3).join(" ");
    });
  };

  private convertToDate(birthDate: number){
    return new Date(birthDate);
  };

  openDialogEditUser(){
   let dialog = this.dialog.open(DialogEditUserComponent);
   dialog.componentInstance.user = new User(this.user);
   dialog.componentInstance.id = this.id;
  }

  openDialogDeleteUser(){
    let dialog = this.dialog.open(DialogDeleteUserComponent);
    dialog.componentInstance.id = this.id;
  }

  //TASKS TABLE
  async getTasks(){
    const tasksRef = collection(this.db, "tasks");
    const q = query(tasksRef, where('userId', "==", this.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    this.allTasks= [];
    querySnapshot.forEach((doc:any) => {
      this.task = new Task(doc.data());
      this.task.taskId = doc.id;
      this.allTasks.push(this.task);
      console.log(this.allTasks)
    });
  })}

    openDialogAddTask(){
      let dialog = this.dialog.open(DialogAddTaskComponent);
      dialog.componentInstance.userId = this.id;
    }

    openDialogEditTask(task:any){
      let dialog = this.dialog.open(DialogEditTaskComponent);
      console.log(task)
      dialog.componentInstance.task = new Task(task);
      dialog.componentInstance.taskId = task.taskId;
      dialog.componentInstance.userId = this.id;
    }
    
  //PURCHASES TABLE
  async getPurchases(){
    const purchasesRef = collection(this.db, "purchases");
    const q = query(purchasesRef, where('userId', "==", this.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    this.allPurchases= [];
    querySnapshot.forEach((doc:any) => {
      this.purchase = new Purchase(doc.data());
      this.purchase.purchaseId = doc.id;
      this.allPurchases.push(this.purchase);
      console.log(this.allPurchases)
    });
  })}

  openDialogAddPurchase(){
    let dialog = this.dialog.open(DialogAddPurchaseComponent);
    dialog.componentInstance.userId = this.id;
  }

  openDialogEditPurchase(purchase: any){
    let dialog = this.dialog.open(DialogEditPurchaseComponent);
    console.log(purchase)
    dialog.componentInstance.purchase = new Purchase(purchase);
    dialog.componentInstance.purchaseId = purchase.purchaseId;
    dialog.componentInstance.userId = this.id;
  }


}