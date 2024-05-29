import { Component, inject } from '@angular/core';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';

@Component({
  selector: 'app-dialog-delete-product',
  standalone: true,
  imports: [MatDialogContent, MatCheckbox, MatDialogActions, CommonModule, MatCheckboxModule, FormsModule, MatButtonModule,
    TranslateModule
  ],
  templateUrl: './dialog-delete-product.component.html',
  styleUrl: './dialog-delete-product.component.scss'
})

export class DialogDeleteProductComponent {
  productId:string;
  checked = false;

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeleteProductComponent>, 
    private _bottomSheet: MatBottomSheet){};
    
  sheetService = inject(BottomSheetService);
  translate = inject(TranslateService);
  
  async deleteProduct(){
    this.database.deleteSelectedProduct(this.productId).then((result:any) =>{
      console.log('deleted product with ID: ', this.productId, result);
      this.dialogRef.close();
      this.openBottomSheet();
    })
  }

  openBottomSheet(){
    this.sheetService.message = "sheet.product-deleted";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
  
}
