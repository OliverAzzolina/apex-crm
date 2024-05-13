import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import {Chart} from 'chart.js';
import { ChartBarComponent } from '../chart-bar/chart-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, CanvasJSAngularChartsModule, CommonModule, ChartBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  allUser:string[] = [];
  userCount: number;
  allProducts:string[] =[];
  productsCount:number;
  allPurchases:any = [];
  totalRev: number;

  constructor(public db: Firestore) {}

  async ngOnInit(){
    await this.getAllUser();
    await this.getAllProducts();
    await this.getAllPurchases()
    //this.calculateMonthlySales();
   
  }

  async getAllUser(){
    const querySnapshot = await getDocs(collection(this.db, "users"));
    querySnapshot.forEach((doc) => {
      const userId = doc.id;
      this.allUser.push(userId)
      this.userCount = this.allUser.length;
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
  }

 
}
