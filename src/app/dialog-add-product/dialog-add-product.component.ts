import { Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../models/product.class';
import { DatabaseService } from '../services/database.service';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-add-product',
  standalone: true,
  imports: [MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, FormsModule, MatSelectModule, 
    MatDialogActions, ReactiveFormsModule, FormsModule, TranslateModule
  ],
  templateUrl: './dialog-add-product.component.html',
  styleUrl: './dialog-add-product.component.scss'
})

export class DialogAddProductComponent {
  product: Product = new Product();
  loading: boolean = false;
  translatedType: string;

  productNameFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  productPriceFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  productTypeFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogAddProductComponent>){};

  translate = inject(TranslateService);
  
  async addProduct(){
    await this.generateTranslatedStatus(this.product.type);
    const productData = this.product.toJSON();
    productData.translatedType = this.translatedType;
    this.loading = true;
    await this.database.saveNewProduct(productData).then((result: any) => {
      console.log('added task', productData);
      this.loading = false;
      this.dialogRef.close();
    });
  }

  async generateTranslatedStatus(type:string){
    if(type == 'Product'){
      this.translatedType = 'Produkt'
    }else{
      this.translatedType = 'Service'
    };
  };
}

