import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-dialog-delete-user',
  standalone: true,
  imports: [MatDialogModule, MatCheckboxModule, CommonModule, FormsModule, MatButtonModule, TranslateModule],
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.scss'
})
export class DialogDeleteUserComponent {
  userId:string;
  checked = false;

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeleteUserComponent>, 
    private _bottomSheet: MatBottomSheet, private router: Router){};
    
  sheetService = inject(BottomSheetService);
  translate = inject(TranslationService);
  darkmode = inject(ThemeService);

  async deleteUser(){
    this.database.deleteSelectedUser(this.userId).then((result:any) =>{
      console.log('deleted Customer with ID: ', this.userId, result);
      this.dialogRef.close();
      this.openBottomSheet();
    });
    this.logoutUser();
  };

  logoutUser(){
    localStorage.removeItem('User');
    this.darkmode.setDarkMode(false);
    this.translate.translationOn = false;
    this.router.navigate(['login']);
  }

  openBottomSheet(){
    this.sheetService.message = "sheet.user-deleted";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
}
