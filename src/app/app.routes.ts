import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
    {path: '', redirectTo:'dashboard' ,pathMatch:'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'user', component: UserComponent},
];
