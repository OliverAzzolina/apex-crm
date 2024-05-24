import { Component, inject } from '@angular/core';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-delete-task',
  standalone: true,
  imports: [MatDialogContent, MatCheckbox, MatDialogActions, CommonModule, MatCheckboxModule, FormsModule, MatButtonModule,
    TranslateModule
  ],
  templateUrl: './dialog-delete-task.component.html',
  styleUrl: './dialog-delete-task.component.scss'
})
export class DialogDeleteTaskComponent {
  taskId: string;
  checked = false;

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeleteTaskComponent>){};

  translate = inject(TranslateService);

  deleteTask(){
      this.database.deleteSelectedTask(this.taskId).then((result:any) =>{
        console.log('deleted Task with ID: ', this.taskId, result);
        this.dialogRef.close();
      });
  };
}
