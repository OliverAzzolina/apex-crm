import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import {Chart} from 'chart.js';
import { ChartBarComponent } from '../chart-bar/chart-bar.component';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, CanvasJSAngularChartsModule, CommonModule, ChartBarComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  allCustomer:string[] = [];
  customerCount: number;
  allProducts:string[] =[];
  productsCount:number;
  allPurchases:any = [];
  totalRev: number;
  totalRevFixed:string;

  constructor(public db: Firestore) {}

  translate = inject(TranslationService);

  async ngOnInit(){
    await this.getAllCustomer();
    await this.getAllProducts();
    await this.getAllPurchases();
  }

  async getAllCustomer(){
    const querySnapshot = await getDocs(collection(this.db, "customers"));
    querySnapshot.forEach((doc) => {
      const customerId = doc.id;
      this.allCustomer.push(customerId)
      this.customerCount = this.allCustomer.length;
    });
  }

  async getAllProducts(){
    const querySnapshot = await getDocs(collection(this.db, "products"));
    querySnapshot.forEach((doc) => {
      const productId = doc.id;
      this.allProducts.push(productId)
      this.productsCount = this.allProducts.length;
    });
  }

  async getAllPurchases(){
    const querySnapshot = await getDocs(collection(this.db, "purchases"));
    querySnapshot.forEach((doc) => {
      const purchaseData = doc.data();
      this.allPurchases.push(purchaseData)
    });
    this.getTotalRevenue();
  }

  getTotalRevenue(){
    this.totalRev = 0;
    for (let i = 0; i < this.allPurchases.length; i++) {
      const purchase = this.allPurchases[i];
      const purchasePrice = purchase['totalPrice']
      this.totalRev += purchasePrice;
    }
    this.totalRevFixed = this.totalRev.toFixed(2);
  }

 
}
