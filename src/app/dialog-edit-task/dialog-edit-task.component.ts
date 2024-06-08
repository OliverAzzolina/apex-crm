import { Component, inject } from '@angular/core';
import { Task } from '../../models/task.class';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { Customer } from '../../models/customer.class';
import { RouterLink } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { DialogDeleteTaskComponent } from '../dialog-delete-task/dialog-delete-task.component';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';

@Component({
  selector: 'app-dialog-edit-task',
  standalone: true,
  imports: [MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, FormsModule, 
    MatSelectModule, MatDialogActions, ReactiveFormsModule, TranslateModule],
  templateUrl: './dialog-edit-task.component.html',
  styleUrl: './dialog-edit-task.component.scss'
})

export class DialogEditTaskComponent {
  customerId: string;
  customer: Customer;
  task: Task;
  taskId: string;
  loading = false;
  translatedStatus: string;

  statusFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  noteFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

  constructor(
    private database: DatabaseService, 
    public dialog: MatDialog, public db: Firestore, 
    public dialogRef: MatDialogRef<DialogEditTaskComponent>, 
    private _bottomSheet: MatBottomSheet
  ){};
    
  sheetService = inject(BottomSheetService);
  translate = inject(TranslationService);

  async ngOnInit(){
    this.statusFormControl.setValue(this.task.status);
    this.noteFormControl.setValue(this.task.note);
  }

  async updateTask(){
    this.task.status = this.statusFormControl.value!;
    this.task.note = this.noteFormControl.value!
    await this.generateTranslatedStatus(this.task.status);
    const taskData = this.task.toJSON();
    this.loading = true;
    taskData.translatedStatus = this.translatedStatus;
    await this.database.saveEditedTask(taskData, this.taskId).then((result: any) => {
      this.loading = false;
      this.dialogRef.close();
      this.openBottomSheet();
    });
  };

  openDialogDeleteTask(){
    let dialog = this.dialog.open(DialogDeleteTaskComponent);
    dialog.componentInstance.taskId = this.taskId;
    this.dialogRef.close();
  };

  async generateTranslatedStatus(status:string){
    if(status == 'open'){
      this.translatedStatus = 'offen'
    }else{
      this.translatedStatus = 'geschlossen'
    }
  };

  openBottomSheet(){
    this.sheetService.message = "sheet.task-save";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
}

