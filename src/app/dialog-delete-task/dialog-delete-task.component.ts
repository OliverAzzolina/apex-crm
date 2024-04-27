import { Component } from '@angular/core';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-delete-task',
  standalone: true,
  imports: [MatDialogContent, MatCheckbox, MatDialogActions, CommonModule, MatCheckboxModule, FormsModule, MatButtonModule],
  templateUrl: './dialog-delete-task.component.html',
  styleUrl: './dialog-delete-task.component.scss'
})
export class DialogDeleteTaskComponent {
  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeleteTaskComponent>){};
  taskId: string;
  checked = false;

  deleteTask(){

      this.database.deleteSelectedTask(this.taskId).then((result:any) =>{
        console.log('deleted user with ID: ', this.taskId, result);
        this.dialogRef.close();
      })
  }
}
