import { Component, Injectable } from '@angular/core';
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
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { SetTabIndexService } from '../services/set-tab-index.service';
import { DialogAddCustomerComponent } from '../dialog-add-customer/dialog-add-customer.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, FormsModule, MatFormFieldModule, 
    MatInputModule, CommonModule, MatCardModule, MatTableModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  customerData:any;
  loading: boolean = false;
  constructor(public db: Firestore, public dialog: MatDialog, public database: DatabaseService, public tabIndex: SetTabIndexService) {}


  openDialog(){
    const dialogRef = this.dialog.open(DialogAddCustomerComponent);
  }

  
  async ngOnInit(): Promise<void>{
    await this.getAllCustomers('customers');
  }

  async getAllCustomers(customers: string) {
    this.loading = true;
    try {
      const customersCollectionRef = collection(this.db, customers);
      this.getCustomersDataOnSnapshot(customersCollectionRef);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }
  }

  getCustomersDataOnSnapshot(customersCollectionRef: any) {
    onSnapshot(
      customersCollectionRef,
      (snapshot: { docs: any[] }) => {
        this.customerData = snapshot.docs.map((doc) => {
          const customerData = doc.data();

          return {
            id: doc.id,
            firstName: customerData['firstName'],
            lastName: customerData['lastName'],
            email: customerData['email'],
            city: customerData['city'],
          };
          
        });
        console.log(this.customerData)
        //this.filterUsers();
        this.loading = false;
      },
      (error) => {
        console.error('Fehler beim laden der Kunden Daten:', error);
        this.loading = false;
      }
    );
  }

  async setTabIndex(index: any){
    await this.tabIndex.setTabToIndex(index);
  }
}
