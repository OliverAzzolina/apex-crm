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
import { User } from '../../models/user.class';
import { Router, RouterLink } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { DialogDeleteTaskComponent } from '../dialog-delete-task/dialog-delete-task.component';


interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-edit-task',
  standalone: true,
  imports: [MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, FormsModule, MatSelectModule, MatDialogActions],
  templateUrl: './dialog-edit-task.component.html',
  styleUrl: './dialog-edit-task.component.scss'
})
export class DialogEditTaskComponent {
  userId: string;
  user: User;
  task: Task;
  taskId: string;
  selectedStatus: string;
  loading = false;

constructor(private database: DatabaseService, public dialog: MatDialog, public db: Firestore, public dialogRef: MatDialogRef<DialogEditTaskComponent>){};

statusOpt: Status[] = [
  {value: 'open', viewValue: 'open'},
  {value: 'closed', viewValue: 'closed'},
];

async updateTask(){
    const taskData = this.task.toJSON();
    this.loading = true;

    await this.database.saveEditedTask(taskData, this.taskId).then((result: any) => {
      console.log('updated task', taskData);
      this.loading = false;
      this.dialogRef.close();
    });
  }

  openDialogDeleteTask(){
    let dialog = this.dialog.open(DialogDeleteTaskComponent);
    dialog.componentInstance.taskId = this.taskId;
    this.dialogRef.close();
  }
}

