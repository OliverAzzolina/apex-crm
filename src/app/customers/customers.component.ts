import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatabaseService } from '../services/database.service';
import { collection, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { SetTabIndexService } from '../services/set-tab-index.service';
import { DialogAddCustomerComponent } from '../dialog-add-customer/dialog-add-customer.component';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginatorModule} from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { SetHeaderService } from '../services/set-header.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, FormsModule, MatFormFieldModule, 
    MatInputModule, CommonModule, MatCardModule, MatTableModule, MatSortModule, MatPaginatorModule, TranslateModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})

export class CustomersComponent{
  customerData:any = [];
  loading: boolean = false;
  
  dataSource = new MatTableDataSource(this.customerData);
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'company', 'position'];
  
  constructor(
    public db: Firestore, 
    public dialog: MatDialog, 
    public database: DatabaseService, 
    public tabIndex: SetTabIndexService, 
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  translate = inject(TranslationService);
  setheader = inject(SetHeaderService);

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
    await this.getAllCustomers('customers');
    this.dataSource.data = this.customerData;
  }

  openDialog(){
    this.dialog.open(DialogAddCustomerComponent);
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
        this.customerData = [];
        this.customerData = snapshot.docs.map((doc) => {
          const customer = doc.data();

          return {
            id: doc.id,
            firstName: customer['firstName'],
            lastName: customer['lastName'],
            email: customer['email'],
            company: customer['company'],
            position: customer['position']
          };
          
        });
        this.dataSource.data = this.customerData;
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
