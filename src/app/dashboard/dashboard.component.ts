import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { collection, getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../services/theme.service';
import { Chart, registerables} from 'chart.js';
import { NavbarService } from '../services/navbar.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, CanvasJSAngularChartsModule, CommonModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  public chart: any;
  allCustomer:string[] = [];
  customerCount: number;
  allProducts:string[] =[];
  productsCount:number;
  allPurchases:any = [];
  totalRev: number;
  totalRevFixed:string;
  chartData:any = [];
  chartLabel:string;
  navbarOn: boolean;

  constructor(public db: Firestore) {
    this.navbar.change.subscribe(emitedValue => {
          this.navbarOn = emitedValue;
          if(this.navbar.navLink == 'dashboard'){
            this.chart.config.options.maintainAspectRatio = false;
            this.chart.canvas.parentNode.style.height = 'auto';
            this.chart.canvas.parentNode.style.width = 'auto';
          }
    });
  }

  translate = inject(TranslationService);
  darkmode = inject(ThemeService)
  navbar = inject(NavbarService)

  async ngOnInit(){
    await this.getAllCustomer();
    await this.getAllProducts();
    await this.getAllPurchases();
    await this.checkForTranslation();
    await this.calculateMonthlySales();
    await this.createChart();
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

 //CHART---------------------------------------------------------

async checkForTranslation(){
  this.chartData = [];

  if(this.translate.translationOn){
    this.chartData = this.chartDataDe;
    this.chartLabel = 'Monatliche Umsätze 2024 in €';
  }else{
    this.chartData = this.chartDataEn;
    this.chartLabel = 'Monthly Sales Volume 2024 in €';
  }
}

async calculateMonthlySales() {
  this.allPurchases.forEach((purchase: { orderdate: string; totalPrice: number; }) => {
    const orderdate = parseInt(purchase.orderdate.split(".").splice(1, 1).toString());
    const price = purchase.totalPrice;  
    for (let i = 0; i < this.chartData.length; i++) {
      const month = this.chartData[i];
      const numberOfMonth = i + 1;
      if (orderdate == numberOfMonth) {
        month.y += price;
      } 
    }
    ;
  });
}

chartDataDe:any = [
  { month: "Jan", y: 0 },
  { month: 'Feb', y: 0 },
  { month: 'Mär', y: 0 },
  { month: 'Apr', y: 0 },
  { month: 'Mai', y: 0 },
  { month: 'Jun', y: 0 },
  { month: 'Jul', y: 0 },
  { month: 'Aug', y: 0 },
  { month: 'Sep', y: 0 },
  { month: 'Okt', y: 0 },
  { month: 'Nov', y: 0 },
  { month: 'Dez', y: 0 },
];

chartDataEn:any = [
  { month: "Jan", y: 0 },
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

async destroyChart(){
  if(this.chart){
      this.chart.destroy();
  }
}

async createChart(){
  await this.destroyChart();
  await this.loadChart();

};

 async loadChart(){
  if(this.darkmode.darkMode){
    this.chart = new Chart("MyChart", { 
      type: 'bar',
      data: {
        labels: this.chartData.map((row: { month: any; }) => row.month),
        datasets: [{
          label: this.chartLabel,
          data: this.chartData.map((row: { y: any; }) => row.y),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {  // 'legend' now within object 'plugins {}'
          legend: {
            labels: {
              color: "white",  // not 'fontColor:' anymore
              // fontSize: 18  // not 'fontSize:' anymore
              font: {
               // size: 18 // 'size' now within object 'font {}'
              }
            }
          }},
          scales: {
                    y: {  // not 'yAxes: [{' anymore (not an array anymore)
                      ticks: {
                        color: "white", // not 'fontColor:' anymore
                        // fontSize: 18,
                        font: {
                          size: 14, // 'size' now within object 'font {}'
                        },
                      
                      
                      }
                    },   
                    x: {  // not 'xAxes: [{' anymore (not an array anymore)
                      ticks: {
                        color: "white",  // not 'fontColor:' anymore
                        //fontSize: 14,
                        font: {
                          size: 14 // 'size' now within object 'font {}'
                        },
                      }
                    }
            }
      }
    });
  }else{
    this.chart = new Chart("MyChart", { 
      type: 'bar',
      data: {
        labels: this.chartData.map((row: { month: any; }) => row.month),
        datasets: [{
          label: this.chartLabel,
          data: this.chartData.map((row: { y: any; }) => row.y),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y'
      }
    });
  }
}

@HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize750px();
  }

  checkScreenSize750px() {
    if (typeof window !== 'undefined') {
      let mobileView = window.innerWidth < 750;

      if (mobileView) {
        this.chart.config.options.responsive = true;
        this.chart.config.options.maintainAspectRatio = false;
      } else {
        this.chart.config.options.responsive = false;
        this.chart.config.options.maintainAspectRatio = true;
      }

      if (this.chart) {
        if (!mobileView && this.chart.data) {
          this.chart.destroy();
          this.createChart();
        }
      }
    }
  }
}