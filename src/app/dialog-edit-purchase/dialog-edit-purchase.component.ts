import { Component } from '@angular/core';
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

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-edit-purchase',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogActions, MatFormField, MatFormFieldModule, MatLabel,
    MatInputModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatCardContent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-edit-purchase.component.html',
  styleUrl: './dialog-edit-purchase.component.scss'
})

export class DialogEditPurchaseComponent {
  purchase:any;
  purchaseId: string;
  userId: string;
  selectedStatus:string;
  selectedProduct:string;
  loading = false;
  productData:any;
  allProducts:any = [];
  product: any;
  totalPrice: number;
  orderDate: Date;

  constructor(private database: DatabaseService,public db: Firestore, public dialogRef: MatDialogRef<DialogEditPurchaseComponent>, public dialog: MatDialog){};

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());


  statusOpt: Status[] = [
    {value: 'ordered', viewValue: 'ordered'},
    {value: 'in process', viewValue: 'in process'},
    {value: 'shipped', viewValue: 'shipped'},
    {value: 'delivered', viewValue: 'delivered'},
  ];

  async ngOnInit(){
    await this.loadAllProducts();
  }

  async loadAllProducts(){
    const querySnapshot = await getDocs(collection(this.db, "products"));
    querySnapshot.forEach((doc) => {
      
      this.product = doc.data();
      this.product.productId = doc.id;
      this.allProducts.push(this.product)
      console.log(this.allProducts);
    });
  }

  getTotalPrice(){
    const ppu = this.product.ppu
    this.purchase.totalPrice = ppu * this.purchase.amount;
    console.log(ppu)
  }

  async updatePurchase(){
    const purchaseData = this.purchase.toJSON();
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
    dialog.componentInstance.userId = this.userId;

    this.dialogRef.close();
  }
}
