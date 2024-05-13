import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ProductsComponent } from './products/products.component';
import { TasksComponent } from './tasks/tasks.component';
import { Purchase } from '../models/purchase.class';
import { PurchasesComponent } from './purchases/purchases.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    {path: '', redirectTo:'/login' ,pathMatch:'full'},
    {path: 'login', component: LoginComponent},
    {path: 'main', component: MainComponent,
        children:[
            {path: 'dashboard', component: DashboardComponent},
            {path: 'user', component: UserComponent},
            {path: 'user/:id', component: UserDetailComponent},
            {path: 'products', component: ProductsComponent},
            {path: 'tasks', component: TasksComponent},
            {path: 'purchases', component: PurchasesComponent},
        ]
    },

];
