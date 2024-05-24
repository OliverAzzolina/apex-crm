import { Component, HostListener, Inject, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import {Chart} from 'chart.js/auto';
import {collection, getDocs } from 'firebase/firestore';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.scss'
})

export class ChartBarComponent {
  public chart: any;
  allPurchases:any = [];
  chartLabel:string;

  constructor(public db: Firestore) {}
  
  translate = inject(TranslationService);
  darkmode = inject(ThemeService);

  @HostListener('window:resize', ['$event'])
    sizeChange(event: any) {
    this.chart.destroy();
    this.createChart();
  }

 async ngOnInit() {
    await this.getAllPurchases();
    await this.checkForTranslation();
    await this.calculateMonthlySales();
    await this.createChart();
  }

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

  chartData:any = [];

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

  async createChart(){
    if(this.darkmode.darkMode){
      this.chart = new Chart("MyChart", {
        type: 'bar', //this denotes tha type of chart
  
        data: {// values on X-Axis
          labels: this.chartData.map((row: { month: any; }) => row.month), 
           datasets: [
            {
              label: this.chartLabel,
              data: this.chartData.map((row: { y: any; }) => row.y),
              backgroundColor: 'rgb(63,81,181)',
              
            },
          ]
        },
        options: {
          aspectRatio:2.5,
          plugins: {  // 'legend' now within object 'plugins {}'
            legend: {
              labels: {
                color: "white",  // not 'fontColor:' anymore
                // fontSize: 18  // not 'fontSize:' anymore
                font: {
                  size: 18 // 'size' now within object 'font {}'
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
        type: 'bar', //this denotes tha type of chart
  
        data: {// values on X-Axis
          labels: this.chartData.map((row: { month: any; }) => row.month), 
           datasets: [
            {
              label: this.chartLabel,
              data: this.chartData.map((row: { y: any; }) => row.y),
              backgroundColor: 'rgb(63,81,181)',
              
            },
          ]
        },
        options: {
                  aspectRatio:2.5,
                }
      });
    };
  };
    

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