import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import {
  MatDialog,
} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  constructor(public dialog: MatDialog) {}
  openDialog(){
    const dialogRef = this.dialog.open(DialogAddUserComponent);
  }
}
