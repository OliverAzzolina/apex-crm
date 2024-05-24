import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  constructor(private database: DatabaseService,public db: Firestore, public dialogRef: MatDialogRef<DialogEditPurchaseComponent>, public dialog: MatDialog){};

  translate = inject(TranslationService);
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

  async ngOnInit(){
    await this.loadAllProducts();
    this.purchase.customerId = this.customerId;
    this.totalPrice = this.purchase.totalPrice;
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
    this.purchase.amount = 1;
    this.totalPrice = this.purchase.ppu  * this.purchase.amount;
  }

  getTotalPrice(){
    this.totalPrice = this.purchase.ppu * this.purchase.amount;
  }

  async updatePurchase(){
    await this.generateTranslatedStatus(this.purchase.status);
    this.purchase.totalPrice = this.totalPrice;
    const purchaseData = this.purchase.toJSON();
    purchaseData.translatedStatus = this.translatedStatus;
    this.loading = true;

    await this.database.saveEditedPurchase(purchaseData, this.purchaseId).then((result: any) => {
      console.log('updated task', purchaseData);
      this.loading = false;
      this.dialogRef.close();
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
}
