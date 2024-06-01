import { Component, inject } from '@angular/core';
import { Task } from '../../models/task.class';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { RouterLink } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { BottomSheetService } from '../services/bottom-sheet.service';


@Component({
  selector: 'app-dialog-add-task',
  standalone: true,
  imports: [ MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, 
    FormsModule, MatSelectModule, MatDialogActions, ReactiveFormsModule, TranslateModule
  ],
  providers: [
    { provide: MatBottomSheetRef, useValue: { dismiss: () => {} } }
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
  translatedStatus: string;

  customerFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  statusFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  noteFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

  constructor(
    private database: DatabaseService, 
    public db: Firestore, 
    public dialogRef: MatDialogRef<DialogAddTaskComponent>,             
    private _bottomSheet: MatBottomSheet
  ){};
              
  sheetService = inject(BottomSheetService);
  translate = inject(TranslationService);
  
  async ngOnInit(){
    await this.loadAllCustomers();
    await this.checkForCustomerId();
  };

  async loadAllCustomers(){
    const querySnapshot = await getDocs(collection(this.db, "customers"));
    querySnapshot.forEach((doc) => {
      this.customer = doc.data();
      this.customer.customerId = doc.id;
      this.allCustomers.push(this.customer)
    });
  };

  async checkForCustomerId(){
    if(this.customerId){
      this.selectedCustomer = this.allCustomers.find( (cust: { customerId: string; }) => this.customerId == cust.customerId );
      this.selectedCustomerName = this.selectedCustomer.firstName + ' ' + this.selectedCustomer.lastName;
    };
  };

  getCustomerId(customerId:string){
    this.customerId = customerId;
  };

  async saveTask() {
    this.task.status = this.statusFormControl.value!;
    this.task.note = this.noteFormControl.value!;
    this.task.customerName = this.customerFormControl.value!;
    await this.generateTranslatedStatus(this.task.status);
    const taskData = this.task.toJSON();
    taskData.customerId = this.customerId;
    taskData.translatedStatus = this.translatedStatus;
    await this.database.saveNewTask(taskData).then((result: any) => {
      console.log('added task', taskData);
      this.loading = false;
      this.dialogRef.close();
      this.openBottomSheet();
    });
  };

  async generateTranslatedStatus(status:string){
    if(status == 'open'){
      this.translatedStatus = 'offen'
    }else{
      this.translatedStatus = 'geschlossen'
    };
  };

  openBottomSheet(){
    this.sheetService.message = "sheet.task-save";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
};