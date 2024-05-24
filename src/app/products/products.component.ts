import { Component, Injectable, inject } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ViewChild} from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, CommonModule, 
    FormsModule, MatInputModule, MatFormFieldModule, RouterLink, MatSortModule, TranslateModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productData:any = [];
  product:any;
  loading: boolean = false;
  translate = inject(TranslationService);
  dataSource = new MatTableDataSource(this.productData);
  displayedColumns: string[] = ['name', 'type', 'ppu'];

  constructor(public db: Firestore, public dialog: MatDialog, public database: DatabaseService, private _liveAnnouncer: LiveAnnouncer) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async ngOnInit(): Promise<void>{
    await this.getAllproducts('products');
    this.dataSource.data = this.productData; 
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
        this.productData = [];
        this.productData = snapshot.docs.map((doc) => {
          const productData = doc.data();
          
          return {
            id: doc.id,
            name: productData['name'],
            productId: doc.id,
            ppu: productData['ppu'],
            type: productData['type'],
            translatedType: productData['translatedType'],
          };
          
        });
        this.dataSource.data = this.productData;
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
