import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { TasksComponent } from './tasks/tasks.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';

export const routes: Routes = [
    {path: '', redirectTo:'/login' ,pathMatch:'full'},
    {path: 'login', component: LoginComponent},
    {path: 'main', component: MainComponent,
        children:[
            {path: 'dashboard', component: DashboardComponent},
            {path: 'customers', component: CustomersComponent},
            {path: 'customers/:id', component: CustomerDetailsComponent},
            {path: 'products', component: ProductsComponent},
            {path: 'tasks', component: TasksComponent},
            {path: 'purchases', component: PurchasesComponent},
        ]
    },

];
