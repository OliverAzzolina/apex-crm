import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../models/product.class';
import { DatabaseService } from '../services/database.service';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DialogDeleteProductComponent } from '../dialog-delete-product/dialog-delete-product.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-edit-product',
  standalone: true,
  imports: [MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, FormsModule, MatSelectModule, 
    MatDialogActions, ReactiveFormsModule, TranslateModule],
  templateUrl: './dialog-edit-product.component.html',
  styleUrl: './dialog-edit-product.component.scss'
})

export class DialogEditProductComponent {
  product: Product;
  productId:string;
  loading:boolean = false;
  translatedType: string;
  
  productNameFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  productPriceFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  productTypeFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

  constructor(private database: DatabaseService,  public dialog: MatDialog, public dialogRef: MatDialogRef<DialogEditProductComponent>){};

  translate = inject(TranslateService);

  async updateProduct(){
    await this.generateTranslatedStatus(this.product.type);  
    const productData = this.product.toJSON();
    productData.translatedType = this.translatedType;
    this.loading = true;

    await this.database.saveEditedProduct(productData, this.productId).then((result: any) => {
      console.log('updated product', productData);
      this.loading = false;
      this.dialogRef.close();
    });
  };

  async openDialogDeleteProduct(){
    let dialog = this.dialog.open(DialogDeleteProductComponent);
    dialog.componentInstance.productId = this.productId;
    this.dialogRef.close();
  };

  async generateTranslatedStatus(type:string){
    if(type == 'Product'){
      this.translatedType = 'Produkt'
    }else{
      this.translatedType = 'Service'
    };
  };
};
