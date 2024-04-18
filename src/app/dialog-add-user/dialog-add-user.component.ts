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

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, MatButtonModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule],
  templateUrl: './dialog-add-user.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {
  user: User = new User;
  birthDate: Date;

  saveUser(){
    this.user.birthDate = this.birthDate.getTime();
    console.log(this.user)
  }

}
