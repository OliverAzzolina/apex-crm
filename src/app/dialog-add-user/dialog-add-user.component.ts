import { Component, inject } from '@angular/core';
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
import { Firestore, addDoc, collection } from 'firebase/firestore';
import { DatabaseService } from '../services/database.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, 
    FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatProgressBarModule
  ],
  templateUrl: './dialog-add-user.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-add-user.component.scss'
})

export class DialogAddUserComponent {

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogAddUserComponent>){};

  user: User = new User();
  birthDate: Date;
  userData: any;
  loading: boolean = false;
  
  async saveUser() {
    this.user.birthDate = this.birthDate.getTime();
    const userData = this.user.toJSON();
    this.loading = true;
    await this.database.saveUser(userData).then((result: any) => {
      console.log('added user', result);
      this.loading = false;
      this.dialogRef.close();
    });
  }


}

    

