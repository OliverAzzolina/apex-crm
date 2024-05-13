import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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


interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-add-product',
  standalone: true,
  imports: [MatMenuModule, RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, MatFormFieldModule, FormsModule, MatSelectModule, 
    MatDialogActions, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './dialog-add-product.component.html',
  styleUrl: './dialog-add-product.component.scss'
})

export class DialogAddProductComponent {
  product: Product = new Product();
  loading: boolean = false;
  constructor(private database: DatabaseService, public dialogRef: MatDialogRef<DialogAddProductComponent>){};

  productNameFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  productPriceFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  productTypeFormControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

  typeOpt: Type[] = [
    {value: 'Product', viewValue: 'Product'},
    {value: 'Service', viewValue: 'Service'},
  ];

  async addProduct(){
      const productData = this.product.toJSON();
      this.loading = true;
      await this.database.saveNewProduct(productData).then((result: any) => {
        console.log('added task', productData);
        this.loading = false;
        this.dialogRef.close();
      });
    }
}

