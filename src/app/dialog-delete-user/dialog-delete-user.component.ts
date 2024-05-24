import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-dialog-delete-user',
  standalone: true,
  imports: [MatDialogModule, MatCheckboxModule, CommonModule, FormsModule, MatButtonModule, TranslateModule],
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.scss'
})
export class DialogDeleteUserComponent {
  router: any;
  userId:string;
  checked = false;

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeleteUserComponent>){};

  translate = inject(TranslationService);

  async deleteUser(){
    this.database.deleteSelectedUser(this.userId).then((result:any) =>{
      console.log('deleted Customer with ID: ', this.userId, result);
      this.dialogRef.close();
    });
  };
}
