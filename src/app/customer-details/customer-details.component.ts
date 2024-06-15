import { Component, HostListener, Input, ViewChild, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { doc, onSnapshot } from "firebase/firestore";
import { Firestore } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSort, Sort } from '@angular/material/sort';
import { Task } from '../../models/task.class';
import { collection, query, where, getDocs } from "firebase/firestore";
import { CommonModule } from '@angular/common';
import { DialogEditTaskComponent } from '../dialog-edit-task/dialog-edit-task.component';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';
import { Purchase } from '../../models/purchase.class';
import { DialogAddPurchaseComponent } from '../dialog-add-purchase/dialog-add-purchase.component';
import { DialogEditPurchaseComponent } from '../dialog-edit-purchase/dialog-edit-purchase.component';
import { SetTabIndexService } from '../services/set-tab-index.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomersComponent } from '../customers/customers.component';
import { Customer } from '../../models/customer.class';
import { DialogEditCustomerComponent } from '../dialog-edit-customer/dialog-edit-customer.component';
import { DialogDeleteCustomerComponent } from '../dialog-delete-customer/dialog-delete-customer.component';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSortModule } from '@angular/material/sort'
import { ThemeService } from '../services/theme.service';
import { SetHeaderService } from '../services/set-header.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [MatCardModule, CommonModule, CustomersComponent, MatIconModule, MatButtonModule, MatTooltipModule, MatTabsModule, MatMenuModule, 
    MatTableModule, MatFormField, MatLabel, MatCheckboxModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, 
    TranslateModule, MatSortModule, MatProgressSpinnerModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})

export class CustomerDetailsComponent {
  constructor(
    private router: Router, 
    public db: Firestore, 
    public dialog: MatDialog, 
    public tabIndex: SetTabIndexService, 
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  id: string;
  customerData: any;
  taskData: any;
  allTasks: any = [];
  allPurchases: any = [];
  customer: Customer = new Customer();
  task: Task = new Task();
  purchase: Purchase = new Purchase();
  birthdate: Date;
  actualTabIndex:any = 0;
  selectedTabIndex = new FormControl( this.actualTabIndex);
  loadPurchases: boolean = false;
  loading: boolean = false;
  taskDataSource = new MatTableDataSource(this.allTasks);
  purchaseDataSource = new MatTableDataSource(this.allPurchases);
  taskColumns: string[] = ['status', 'note', 'due'];
  purchaseColumns: string[] = ['purchaseId', 'orderdate', 'status', 'product', 'amount', 'totalPrice'];
  noTasks: boolean = false;
  noPurchases: boolean = false;
  color: any;

  translate = inject(TranslationService);
  darkmode = inject(ThemeService);
  setheader = inject(SetHeaderService);

  async ngOnInit(){
    this.id = this.router.url.split('/').splice(3, 1).toString();
    await this.checkUser();
    await this.getCustomerData();
    await this.getPurchases();
    await this.getTasks();
    await this.setNewTabIndex();
    this.setheader.updateCustomerHeader();
    this.taskDataSource.data = this.allTasks; 
    this.purchaseDataSource.data = this.allPurchases; 
    this.checkScreenSize();
  }

  async checkUser() {
    const data = JSON.parse(localStorage.getItem("loggedUserData") || '{}');
    this.checkUserSettings(data.translation, data.darkmode);
  }

  checkUserSettings(translation: boolean, darkmode: boolean) {
    if (translation) {
      this.translate.switchLanguage(true);
    }
    if (darkmode) {
      this.darkmode.setDarkMode(true);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.taskDataSource.filter = filterValue.trim().toLowerCase();
    this.purchaseDataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild('purchaseTable', { read: MatSort, static: true}) sortPurchaseTable: MatSort;
  @ViewChild('tasksTable', { read: MatSort, static: true}) sortTasksTable: MatSort;

  ngAfterViewInit() {
    this.taskDataSource.sort = this.sortTasksTable;
    this.purchaseDataSource.sort = this.sortPurchaseTable;
    this.purchaseDataSource.sortingDataAccessor = (purchaseData:any, orderdate) => {
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

  async setNewTabIndex(){
    this.actualTabIndex = this.tabIndex.tabIndex;
    this.selectedTabIndex = new FormControl( this.actualTabIndex);
  }

  async getCustomerData(){
    onSnapshot(doc(this.db, "customers", this.id), (doc) => {
          this.customer = new Customer(doc.data());
          this.birthdate = this.convertToDate(this.customer.birthDate);
          this.customer.birthdate = this.birthdate.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'numeric', year: 'numeric'
          }).replaceAll('/', '.');
    });
  };

  private convertToDate(birthDate: number){
    return new Date(birthDate);
  };

  openDialogEditCustomer(){
   let dialog = this.dialog.open(DialogEditCustomerComponent);
   dialog.componentInstance.customer = new Customer(this.customer);
   dialog.componentInstance.id = this.id;
  }

  openDialogDeleteCustomer(){
    let dialog = this.dialog.open(DialogDeleteCustomerComponent);
    dialog.componentInstance.id = this.id;
    dialog.componentInstance.allTasks = this.allTasks;
    dialog.componentInstance.allPurchases = this.allPurchases;
  }
  
  //TASKS TABLE
  async getTasks(){
    this.noTasks = false;
    const tasksRef = collection(this.db, "tasks");
    const q = query(tasksRef, where('customerId', "==", this.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    this.allTasks= [];
    querySnapshot.forEach((doc:any) => {
      this.task = new Task(doc.data());
      this.task.taskId = doc.id;
      this.allTasks.push(this.task);
    });
    this.checkNoTasks();
    this.sortTasks();
    this.checkTaskDueDate()
    this.taskDataSource.data = this.allTasks;
  })}

  async checkNoTasks(){
    if(this.allTasks.length == 0){
      this.noTasks = true;
    }
  }

  openDialogAddTask(){
    let dialog = this.dialog.open(DialogAddTaskComponent);
    dialog.componentInstance.customerId = this.id;
    dialog.componentInstance.customerName = this.customer.firstName + ' ' + this.customer.lastName;
  }

  openDialogEditTask(task:any){
    let dialog = this.dialog.open(DialogEditTaskComponent);
    dialog.componentInstance.task = new Task(task);
    dialog.componentInstance.taskId = task.taskId;
    dialog.componentInstance.customerId = this.id;
  }

  async sortTasks(){
    this.allTasks.sort((a: { status: string; }, b: { status: any; }) => b.status.localeCompare(a.status))
  }

  checkTaskDueDate(){
    const today = new Date().getTime();
    this.allTasks.forEach((task: {
      exceeded: boolean; dueDateStamp: number;
    }) => {
      if(task.dueDateStamp <= today){
        task.exceeded = true;
      }else{
        task.exceeded = false;
        if(this.darkmode.darkMode){
          this.color = {'color':'white'}
        }else{
          this.color = {'color':'black'}
        }
      }
    });
  }
    
  //PURCHASES TABLE
  async getPurchases(){
    this.noPurchases = false;
    const purchasesRef = collection(this.db, "purchases");
    const q = query(purchasesRef, where('customerId', "==", this.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    this.allPurchases= [];
    querySnapshot.forEach((doc:any) => {
      this.purchase = new Purchase(doc.data());
      this.purchase.purchaseId = doc.id;
      this.allPurchases.push(this.purchase);
    });
    this.checkNoPurchases();
    this.sortPurchases();
    this.purchaseDataSource.data = this.allPurchases;
    this.loadPurchases = true; 
  })}

  checkNoPurchases(){
    if(this.allPurchases.length == 0){
      this.noPurchases = true;
    }
  }

  openDialogAddPurchase(){
    let dialog = this.dialog.open(DialogAddPurchaseComponent);
    dialog.componentInstance.customerId = this.id;
  }

  openDialogEditPurchase(purchase: any){
    let dialog = this.dialog.open(DialogEditPurchaseComponent);
    dialog.componentInstance.purchase = new Purchase(purchase);
    dialog.componentInstance.purchaseId = purchase.purchaseId;
    dialog.componentInstance.customerId = this.id;
  }

  async sortPurchases(){
    this.allPurchases.sort(function(x: { orderDate: number; },y: { orderDate: number; }){
      return y.orderDate - x.orderDate
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize()
  }

  checkScreenSize(){
    if(typeof window !== undefined){
      const width = window.innerWidth;
      if(width > 1280){
        this.purchaseColumns = ['purchaseId', 'orderdate', 'status', 'product', 'amount', 'totalPrice'];
      }
      if(width <= 1280){
        this.purchaseColumns = ['purchaseId', 'orderdate', 'status', 'product', 'totalPrice'];
      }
      if(width <= 860){
        this.purchaseColumns = ['purchaseId', 'orderdate',];
      }
    }
  }
}
