import { Component } from '@angular/core';
import { Task } from '../../models/task.class';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
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

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-add-task',
  standalone: true,
  imports: [ MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, 
    FormsModule, MatSelectModule, MatDialogActions
  ],
  templateUrl: './dialog-add-task.component.html',
  styleUrl: './dialog-add-task.component.scss'
})
export class DialogAddTaskComponent {

  customerName:string;
  customerId: string;
  customer: Customer;
  task: Task = new Task();
  taskId: string;
  loading = false;
  taskData: any;

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogAddTaskComponent>){};

statusOpt: Status[] = [
  {value: 'open', viewValue: 'open'},
  {value: 'closed', viewValue: 'closed'},
];


async saveTask() {
  
  const taskData = this.task.toJSON();
  taskData.customerId = this.customerId;
  taskData.customerName = this.customerName;
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
