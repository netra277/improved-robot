import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, UsersComponent, BranchesComponent, 
  LoginComponent, CategoriesComponent, ItemsComponent, OrdersComponent, CreateOrderComponent, ContactUsComponent} from './components';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './models';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  {
    path:'',
    component:CreateOrderComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'branches',
    component: BranchesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'items',
    component: ItemsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'create-order',
    component: CreateOrderComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin]}
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
