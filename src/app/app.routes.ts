import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ProductsComponent } from './products/products.component';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
    {path: '', redirectTo:'dashboard' ,pathMatch:'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'user', component: UserComponent},
    {path: 'user/:id', component: UserDetailComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'tasks', component: TasksComponent},
];
