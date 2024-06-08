import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatabaseService } from '../services/database.service';
import { RouterLink } from '@angular/router';
import { SetTabIndexService } from '../services/set-tab-index.service';
import { SetHeaderService } from '../services/set-header.service';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ViewChild} from '@angular/core';
import { DialogAddPurchaseComponent } from '../dialog-add-purchase/dialog-add-purchase.component';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatTableModule, MatIconModule, MatTooltipModule, MatButtonModule, MatDialogModule, RouterLink,
    FormsModule, MatInputModule, MatFormFieldModule, MatSort, MatSortModule, TranslateModule
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})

export class PurchasesComponent {
purchaseData: any = [];
loading: boolean = false;
customerId: any;
dataSource = new MatTableDataSource(this.purchaseData);
displayedColumns: string[] = ['purchaseId', 'orderdate', 'status', 'product', 'amount', 'totalPrice'];

constructor(public db: Firestore, public dialog: MatDialog, public database: DatabaseService, public tabIndex: SetTabIndexService, 
  public setHeader: SetHeaderService, private _liveAnnouncer: LiveAnnouncer) {}
  setheader = inject(SetHeaderService);
  translate = inject(TranslationService);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (purchaseData:any, orderdate) => {
      switch (orderdate) {
        case 'orderdate': return new Date(purchaseData.orderdate);
        default: return purchaseData[orderdate];
      }
    };
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

  async ngOnInit(){
    await this.getAllPurchases('purchases');
    this.dataSource.data = this.purchaseData; 
    this.checkScreenSize();
  }

  openDialogAddPurchase(){
      let dialog = this.dialog.open(DialogAddPurchaseComponent);
      //dialog.componentInstance.customerId = this.id;
    }
  

  async getAllPurchases(purchases: string) {
    this.loading = true;
    try {
      const purchasesCollectionRef = collection(this.db, purchases);
      this.getPurchaseDataOnSnapshot(purchasesCollectionRef);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }
  }

  getPurchaseDataOnSnapshot(purchasesCollectionRef: any){
    onSnapshot(
      purchasesCollectionRef,
      (snapshot: { docs: any[] }) => {
        this.purchaseData = []; 
        this.purchaseData = snapshot.docs.map((doc) => {
          const purchaseData = doc.data();

          return {
            purchaseId: doc.id,
            status: purchaseData['status'],
            orderdate: purchaseData['orderdate'],
            orderDate: purchaseData['orderDate'],
            product: purchaseData['product'],
            amount: purchaseData['amount'],
            totalPrice: purchaseData['totalPrice'],
            customerId: purchaseData['customerId'],
            translatedStatus: purchaseData['translatedStatus']
          };
          
        });
        this.sortPurchases();
        this.dataSource.data = this.purchaseData;
        this.loading = false;
      },
      (error) => {
        console.error('Fehler beim laden der Kauf Daten:', error);
        this.loading = false;
      }
    );
  };

  async sortPurchases(){
    this.purchaseData.sort(function(x: { orderDate: number; },y: { orderDate: number; }){
      return y.orderDate - x.orderDate
    })
  }

  async setTabIndex(index: any){
    await this.tabIndex.setTabToIndex(index);
  }

  async setNewHeader(newHeader:string){
    await this.setHeader.updateHeader(newHeader);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize(){
    const width = window.innerWidth;
    if(width > 1280){
      this.displayedColumns = ['purchaseId', 'orderdate', 'status', 'product', 'amount', 'totalPrice'];
      
    }
    if(width <= 1280){
      this.displayedColumns = ['purchaseId', 'orderdate', 'status', 'product', 'totalPrice'];
    }
    if(width <= 1120){
      this.displayedColumns = ['purchaseId', 'orderdate', 'status', 'totalPrice'];
    }
    if(width <= 1000){
      this.displayedColumns = ['purchaseId', 'orderdate', 'status'];
    }
    if(width <= 820){
      this.displayedColumns = ['purchaseId', 'orderdate'];
    }
  };
}
