import { Component, inject } from '@angular/core';
import { Purchase } from '../../models/purchase.class';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { DatabaseService } from '../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';

@Component({
  selector: 'app-dialog-delete-purchase',
  standalone: true,
  imports: [ MatDialogContent, MatCheckbox, MatDialogActions, CommonModule, FormsModule, MatButtonModule, TranslateModule],
  templateUrl: './dialog-delete-purchase.component.html',
  styleUrl: './dialog-delete-purchase.component.scss'
})

export class DialogDeletePurchaseComponent {
  purchase: Purchase;
  purchaseId: string;
  customerId:string;
  checked = false;

  constructor(
    private database: DatabaseService, 
    public dialogRef: MatDialogRef<DialogDeletePurchaseComponent>, 
    private _bottomSheet: MatBottomSheet
  ){};
    
  sheetService = inject(BottomSheetService);
  translate = inject(TranslationService);

  deletePurchase(){
    this.database.deleteSelectedPurchase(this.purchaseId).then((result:any) =>{
      this.dialogRef.close();
      this.openBottomSheet();
    })
  }

  openBottomSheet(){
    this.sheetService.message = "sheet.purchase-deleted";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
}
