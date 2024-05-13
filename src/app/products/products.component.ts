import { Component, Injectable } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog,} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { DatabaseService } from '../services/database.service';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component';
import { Product } from '../../models/product.class';
import { DialogEditProductComponent } from '../dialog-edit-product/dialog-edit-product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productData:any;
  product:any;
  loading: boolean = false;
  constructor(public db: Firestore, public dialog: MatDialog, public database: DatabaseService) {}

  async ngOnInit(): Promise<void>{
    await this.getAllproducts('products');
  }

  async getAllproducts(products: string) {
    this.loading = true;
    try {
      const productssCollectionRef = collection(this.db, products);
      this.getProductDataOnSnapshot(productssCollectionRef);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }
  }

  getProductDataOnSnapshot(productssCollectionRef: any){
    onSnapshot(
      productssCollectionRef,
      (snapshot: { docs: any[] }) => {
        this.productData = snapshot.docs.map((doc) => {
          const productData = doc.data();
          

          return {
            id: doc.id,
            name: productData['name'],
            productId: doc.id,
            ppu: productData['ppu'],
            type: productData['type'],
          };
          
        });
        console.log(this.productData)
        //this.filterUsers();
        this.loading = false;
      },
      (error) => {
        console.error('Fehler beim laden der User Daten:', error);
        this.loading = false;
      }
    );
  };

  openDialogAddProduct(){
    let dialog = this.dialog.open(DialogAddProductComponent);
  }

  openDialogEditProduct(product:any){
    let dialog = this.dialog.open(DialogEditProductComponent);
    dialog.componentInstance.product = new Product(product);
    dialog.componentInstance.productId = product.productId;
    console.log(product)
  }
}
