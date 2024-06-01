import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { DatabaseService } from '../services/database.service';
import { Purchase } from '../../models/purchase.class';
import { Firestore, collection, getDocs, onSnapshot } from '@angular/fire/firestore';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DialogDeletePurchaseComponent } from '../dialog-delete-purchase/dialog-delete-purchase.component';
import {MatCardModule} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';

@Component({
  selector: 'app-dialog-edit-purchase',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogActions, MatFormField, MatFormFieldModule, MatLabel,
    MatInputModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatCardContent, MatCardModule, TranslateModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-edit-purchase.component.html',
  styleUrl: './dialog-edit-purchase.component.scss'
})

export class DialogEditPurchaseComponent {
  purchase:any;
  purchaseId: string;
  customerId: string;
  selectedStatus:string;
  selectedProduct:string;
  loading = false;
  productData:any;
  allProducts:any = [];
  product: any;
  productPrice: number;
  totalPrice: number;
  orderDate: Date;
  translatedStatus:string;

  customerFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  dateFormControl = new FormControl(new Date(), [Validators.required, Validators.minLength(2)]);
  statusFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  productFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  amountFormControl = new FormControl(1, [Validators.required, Validators.minLength(1)]);

  constructor(
    private database: DatabaseService,
    public db: Firestore, 
    public dialogRef: MatDialogRef<DialogEditPurchaseComponent>, 
    public dialog: MatDialog, 
    private _bottomSheet: MatBottomSheet
  ){};
    
  sheetService = inject(BottomSheetService);
  translate = inject(TranslationService);
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

  async ngOnInit(){
    await this.loadAllProducts();
    this.purchase.customerId = this.customerId;
    this.totalPrice = this.purchase.totalPrice;
    this.statusFormControl.setValue(this.purchase.status);
    this.productFormControl.setValue(this.purchase.product);
    this.amountFormControl.setValue(this.purchase.amount);
    console.log(this.purchase.amount)
  }

  async loadAllProducts(){
    const querySnapshot = await getDocs(collection(this.db, "products"));
    querySnapshot.forEach((doc) => {
      this.product = doc.data();
      this.product.productId = doc.id;
      this.allProducts.push(this.product)
    });
  }

  getProductPrice(ppu: number){
    this.purchase.ppu = ppu;
    this.purchase.amount = this.amountFormControl.value!;
    this.totalPrice = this.purchase.ppu  * this.purchase.amount;
  }

  getTotalPrice(){
    this.totalPrice = this.purchase.ppu * this.amountFormControl.value!;
    console.log(this.totalPrice)
  }

  async updatePurchase(){
    this.purchase.status = this.statusFormControl.value!;
    this.purchase.amount = this.amountFormControl.value!;
    this.purchase.totalPrice = this.totalPrice;
    await this.generateTranslatedStatus(this.purchase.status);
    
    const purchaseData = this.purchase.toJSON();
    purchaseData.translatedStatus = this.translatedStatus;
    this.loading = true;

    await this.database.saveEditedPurchase(purchaseData, this.purchaseId).then((result: any) => {
      console.log('updated task', purchaseData);
      this.loading = false;
      this.dialogRef.close();
      this.openBottomSheet();
    });
  }

  openDialogDeletePurchase(purchase: any){
    let dialog = this.dialog.open(DialogDeletePurchaseComponent);
    dialog.componentInstance.purchase = new Purchase(purchase);
    dialog.componentInstance.purchaseId = purchase.purchaseId;
    dialog.componentInstance.customerId = this.customerId;
    this.dialogRef.close();
  }

  async generateTranslatedStatus(status:string){
    if(status == 'ordered'){
      this.translatedStatus = 'bestellt'
    }else if(status == 'in process'){
      this.translatedStatus = 'in Bearbeitung'
    }else if(status == 'shipped'){
      this.translatedStatus = 'versendet'
    }else if(status == 'delivered'){
      this.translatedStatus = 'geliefert'
    };
  };

  openBottomSheet(){
    this.sheetService.message = "sheet.purchase-save";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
}
