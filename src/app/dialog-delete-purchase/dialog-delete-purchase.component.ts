import { Component, TRANSLATIONS_FORMAT, inject } from '@angular/core';
import { Purchase } from '../../models/purchase.class';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { DatabaseService } from '../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

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

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeletePurchaseComponent>){};

  translate = inject(TranslationService);

  deletePurchase(){
    this.database.deleteSelectedPurchase(this.purchaseId).then((result:any) =>{
      console.log('deleted purchase with ID: ', this.purchaseId, result);
      this.dialogRef.close();
    })
  }
}
