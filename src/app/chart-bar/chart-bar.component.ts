import { Component, HostListener } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {Chart} from 'chart.js/auto';
import {collection, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.scss'
})

export class ChartBarComponent {
  public chart: any;
  allPurchases:any = [];

  constructor(public db: Firestore) {}
  
  @HostListener('window:resize', ['$event'])
    sizeChange(event: any) {
    this.chart.destroy();
    this.createChart();
  }

 async ngOnInit() {
    await this.getAllPurchases()
    await this.calculateMonthlySales()
    await this.createChart();
  }

  chartData:any = [
    { month: 'Jan', y: 0 },
    { month: 'Feb', y: 0 },
    { month: 'Mar', y: 0 },
    { month: 'Apr', y: 0 },
    { month: 'May', y: 0 },
    { month: 'Jun', y: 0 },
    { month: 'Jul', y: 0 },
    { month: 'Aug', y: 0 },
    { month: 'Sep', y: 0 },
    { month: 'Oct', y: 0 },
    { month: 'Nov', y: 0 },
    { month: 'Dec', y: 0 },
  ];

  async createChart(){
   
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.chartData.map((row: { month: any; }) => row.month), 
	       datasets: [
          {
            label: "Monthly Sales Volume",
            data: this.chartData.map((row: { y: any; }) => row.y),
            backgroundColor: 'rgb(63,81,181)'
          },
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }

  async getAllPurchases(){
    const querySnapshot = await getDocs(collection(this.db, "purchases"));
    querySnapshot.forEach((doc) => {
      const purchaseData = doc.data();
      this.allPurchases.push(purchaseData)
    });
  }

  async calculateMonthlySales() {
    this.allPurchases.forEach((purchase: { orderdate: string; totalPrice: number; }) => {
      const orderdate = purchase.orderdate.split(" ").splice(0, 1).toString();
      const price = purchase.totalPrice;  
      for (let i = 0; i < this.chartData.length; i++) {
        const month = this.chartData[i];
        if (orderdate == month.month) {
          month.y += price;
        } 
      }
      ;
    });
  }
}
