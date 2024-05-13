import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../models/product.class';
import { DatabaseService } from '../services/database.service';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DialogDeleteProductComponent } from '../dialog-delete-product/dialog-delete-product.component';

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-edit-product',
  standalone: true,
  imports: [MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, FormsModule, MatSelectModule, 
    MatDialogActions],
  templateUrl: './dialog-edit-product.component.html',
  styleUrl: './dialog-edit-product.component.scss'
})


export class DialogEditProductComponent {
  product: Product;
  productId:string;
  loading:boolean = false;

  constructor(private database: DatabaseService,  public dialog: MatDialog, public dialogRef: MatDialogRef<DialogEditProductComponent>){};

  typeOpt: Type[] = [
    {value: 'Product', viewValue: 'Product'},
    {value: 'Service', viewValue: 'Service'},
  ];


  async updateProduct(){
    const productData = this.product.toJSON();
    this.loading = true;
  
    await this.database.saveEditedProduct(productData, this.productId).then((result: any) => {
      console.log('updated product', productData);
      this.loading = false;
      this.dialogRef.close();
    });
  }

  async openDialogDeleteProduct(){
    let dialog = this.dialog.open(DialogDeleteProductComponent);
    dialog.componentInstance.productId = this.productId;
    this.dialogRef.close();
  }
}
