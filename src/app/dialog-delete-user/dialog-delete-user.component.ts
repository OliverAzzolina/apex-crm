import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dialog-delete-user',
  standalone: true,
  imports: [MatDialogModule, MatCheckboxModule, CommonModule, FormsModule, MatButtonModule, RouterLink],
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.scss'
})
export class DialogDeleteUserComponent {
  router: any;
  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeleteUserComponent>){};

id:string;
checked = false;


async deleteUser(){
  this.database.deleteSelectedUser(this.id).then((result:any) =>{
    console.log('deleted user with ID: ', this.id, result);
    this.dialogRef.close();
  })

}
 
}
