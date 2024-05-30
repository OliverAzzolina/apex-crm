import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-dialog-add-purchase',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ MatMenuModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule, MatFormField, MatLabel, MatInputModule, 
    MatFormFieldModule, FormsModule, MatSelectModule, MatDialogActions, ReactiveFormsModule, TranslateModule],
  templateUrl: './dialog-add-purchase.component.html',
  styleUrl: './dialog-add-purchase.component.scss'
})

export class DialogAddPurchaseComponent {
  customer:any;
  customerId: string;
  purchase: Purchase = new Purchase();
  selectedStatus:string;
  selectedProduct:string;
  selectedCustomer:any;
  selectedCustomerName:string;
  loading = false;
  productData:any;
  allCustomers:any = [];
  allProducts:any = [];
  product: any;
  totalPrice: number;
  orderDate: Date;
  productPrice: number = 0;
  translatedStatus:string;

  customerFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  dateFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  statusFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  productFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  amountFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

  constructor(private database: DatabaseService, public db: Firestore, public dialogRef: MatDialogRef<DialogAddPurchaseComponent>,     
    private _bottomSheet: MatBottomSheet
  ){};
  sheetService = inject(BottomSheetService);

  translate = inject(TranslateService);
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  

  async ngOnInit(){
    await this.loadAllProducts();
    await this.loadAllCustomers();
    await this.checkForCustomerId();
  }

  async checkForCustomerId(){
    if(this.customerId){
      this.selectedCustomer = this.allCustomers.find( (cust: { customerId: string; }) => this.customerId == cust.customerId );
      this.selectedCustomerName = this.selectedCustomer.firstName + ' ' + this.selectedCustomer.lastName;
      console.log(this.selectedCustomerName)
    }
  }

  async loadAllProducts(){
    const querySnapshot = await getDocs(collection(this.db, "products"));
    querySnapshot.forEach((doc) => {
      this.product = doc.data();
      this.product.productId = doc.id;
      this.allProducts.push(this.product)
    });
  }

  async loadAllCustomers(){
    const querySnapshot = await getDocs(collection(this.db, "customers"));
    querySnapshot.forEach((doc) => {
      this.customer = doc.data();
      this.customer.customerId = doc.id;
      this.allCustomers.push(this.customer)
    });
  }

  getCustomerId(customerId:string){
    this.customerId = customerId;
  }

  getProductPrice(ppu: number){
    this.productPrice = ppu;
    this.purchase.amount = 1;
    this.totalPrice = this.productPrice  * this.purchase.amount;
  }

  getTotalPrice(){
    this.totalPrice = this.productPrice  * this.purchase.amount;
  }

  async savePurchase(){
    await this.generateTranslatedStatus(this.purchase.status);
    this.purchase.ppu = this.productPrice;
    this.purchase.totalPrice = this.totalPrice;
    this.purchase.orderDate = this.orderDate.getTime();
    this.orderDate = this.convertToDate(this.purchase.orderDate);
    this.purchase.orderdate = this.orderDate.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    }).replaceAll('/', '.');
    const purchaseData = this.purchase.toJSON();
    purchaseData.customerId = this.customerId;
    purchaseData.translatedStatus = this.translatedStatus;
    this.loading = true;
    await this.database.saveNewPurchase(purchaseData).then((result: any) => {
      console.log('added purchase', purchaseData);
      this.loading = false;
      this.dialogRef.close();
      this.openBottomSheet();
  })}

  convertToDate(orderdate: number){
    return new Date(orderdate);
  };

  async generateTranslatedStatus(status:string){
    if(status == 'ordered'){
      this.translatedStatus = 'bestellt'
    }
    if(status == 'in process'){
      this.translatedStatus = 'in Bearbeitung'
    }
    if(status == 'shipped'){
      this.translatedStatus = 'versendet'
    }
    if(status == 'delivered'){
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