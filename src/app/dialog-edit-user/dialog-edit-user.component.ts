import { Component } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../../models/user.class';

import { DatabaseService } from '../services/database.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, 
    FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatProgressBarModule],
  templateUrl: './dialog-edit-user.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {
loading: boolean = false;
user: User;
birthDate: Date;
birthdate:Date;
id:string;


constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogEditUserComponent>){};

private convertToDate(birthDate: number){
  return new Date(birthDate);
};

ngOnInit(){
  this.birthdate = this.convertToDate(this.user.birthDate);
}


async saveUser() {
  this.user.birthDate = this.birthdate.getTime();
  const userData = this.user.toJSON();
  this.loading = true;
  await this.database.saveEditedUser(userData, this.id).then((result: any) => {
    console.log('updated user', result);
    this.loading = false;
    this.dialogRef.close();
  });
}
}
