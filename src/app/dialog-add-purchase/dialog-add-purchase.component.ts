import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { DatabaseService } from '../services/database.service';
import { Purchase } from '../../models/purchase.class';
import { Firestore, collection, getDocs, onSnapshot } from '@angular/fire/firestore';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

interface Status {
  value: string;
  viewValue: string;
}

interface Product {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-add-purchase',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ MatMenuModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, FormsModule, MatSelectModule, MatDialogActions,],
  templateUrl: './dialog-add-purchase.component.html',
  styleUrl: './dialog-add-purchase.component.scss'
})
export class DialogAddPurchaseComponent {
  customerId: string;
  purchase: Purchase = new Purchase();
  selectedStatus:string;
  selectedProduct:string;
  loading = false;
  productData:any;
  allProducts:any = [];
  product: any;
  totalPrice: number;
  orderDate: Date;
  productPrice: number = 0;


  constructor(private database: DatabaseService,public db: Firestore, public dialogRef: MatDialogRef<DialogAddPurchaseComponent>){};

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  

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


  statusOpt: Status[] = [
    {value: 'ordered', viewValue: 'ordered'},
    {value: 'in process', viewValue: 'in process'},
    {value: 'shipped', viewValue: 'shipped'},
    {value: 'delivered', viewValue: 'delivered'},
  ];

  getProductPrice(ppu: number){
    this.productPrice = ppu;
    this.purchase.amount = 1;
    this.totalPrice = this.productPrice  * this.purchase.amount;
  }

  getTotalPrice(){
    this.totalPrice = this.productPrice  * this.purchase.amount;
  }

  async savePurchase(){
    this.purchase.ppu = this.productPrice;
    this.purchase.totalPrice = this.totalPrice;
    this.purchase.orderDate = this.orderDate.getTime();
    this.orderDate = this.convertToDate(this.purchase.orderDate);
    this.purchase.orderdate = this.orderDate.toString().split(" ").splice(1,3).join(" ");
    const purchaseData = this.purchase.toJSON();
    purchaseData.customerId = this.customerId;
    this.loading = true;
    await this.database.saveNewPurchase(purchaseData).then((result: any) => {
      console.log('added purchase', purchaseData);
      this.loading = false;
      this.dialogRef.close();
  })}

  convertToDate(orderdate: number){
    return new Date(orderdate);
  };
}