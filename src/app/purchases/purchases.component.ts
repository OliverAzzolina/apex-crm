import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatTableModule, MatIconModule, MatTooltipModule, MatButtonModule, MatDialogModule, RouterLink],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent {
purchaseData: any;

loading: boolean = false;
userId: any;
constructor(public db: Firestore, public dialog: MatDialog, public database: DatabaseService, public tabIndex: SetTabIndexService, public setHeader: SetHeaderService) {}

  async ngOnInit(): Promise<void>{
    await this.getAllPurchases('purchases');
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
        this.purchaseData = snapshot.docs.map((doc) => {
          const purchaseData = doc.data();

          return {
            purchaseId: doc.id,
            status: purchaseData['status'],
            orderdate: purchaseData['orderdate'],
            product: purchaseData['product'],
            amount: purchaseData['amount'],
            totalPrice: purchaseData['totalPrice'],
            userId: purchaseData['userId'],
          };
          
        });
        this.loading = false;
      },
      (error) => {
        console.error('Fehler beim laden der Kauf Daten:', error);
        this.loading = false;
      }
    );
  };

  async setTabIndex(index: any){
    await this.tabIndex.setTabToIndex(index);
  }

  async setNewHeader(newHeader:string){
    await this.setHeader.updateHeader(newHeader);
  }
}
