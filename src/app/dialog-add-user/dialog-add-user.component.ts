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
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
    FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatProgressBarModule, FormsModule, ReactiveFormsModule
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

  firstNameFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  lastNameFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  birthdateFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  phoneFormControl = new FormControl('', [Validators.required, Validators.minLength(7)]);
  streetFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  numberFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  zipCodeFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  cityFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

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

    

