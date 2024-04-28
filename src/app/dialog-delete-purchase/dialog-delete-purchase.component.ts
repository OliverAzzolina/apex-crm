import { Component } from '@angular/core';
import { Purchase } from '../../models/purchase.class';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { DatabaseService } from '../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-delete-purchase',
  standalone: true,
  imports: [ MatDialogContent, MatCheckbox, MatDialogActions, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './dialog-delete-purchase.component.html',
  styleUrl: './dialog-delete-purchase.component.scss'
})
export class DialogDeletePurchaseComponent {
  purchase: Purchase;
  purchaseId: string;
  userId:string;

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogDeletePurchaseComponent>){};
  checked = false;

  deletePurchase(){
    this.database.deleteSelectedPurchase(this.purchaseId).then((result:any) =>{
      console.log('deleted purchase with ID: ', this.purchaseId, result);
      this.dialogRef.close();
    })
  }
}
