import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';

@Component({
  selector: 'app-dialog-delete-customer',
  standalone: true,
  imports: [MatDialogModule, MatCheckboxModule, CommonModule, FormsModule, MatButtonModule, RouterLink, TranslateModule],
  templateUrl: './dialog-delete-customer.component.html',
  styleUrl: './dialog-delete-customer.component.scss'
})

export class DialogDeleteCustomerComponent {
  router: any;
  id:string;
  checked = false;

  constructor(
    private database: DatabaseService, 
    public dialogRef: MatDialogRef<DialogDeleteCustomerComponent>, 
    private _bottomSheet: MatBottomSheet
  ){};
    
  sheetService = inject(BottomSheetService);
  translate = inject(TranslationService);

  async deleteCustomer(){
    this.database.deleteSelectedCustomer(this.id).then((result:any) =>{
      this.dialogRef.close();
      this.openBottomSheet();
    });
  };

  openBottomSheet(){
    this.sheetService.message = "sheet.customer-deleted";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
}
