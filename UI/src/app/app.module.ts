import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'src/app/commons/components/alert/alert.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LoginComponent, UsersComponent, UserComponent, 
  BranchesComponent, BranchComponent, CategoriesComponent, 
  CategoryComponent, ItemsComponent, ItemComponent, 
  OrdersComponent, CreateOrderComponent, OrderDetailsComponent, ContactUsComponent, CreateBranchComponent } from './components';
import { BranchService } from './services';
import { GridFilterPipe } from './commons/pipes/grid-filter.pipe';
import { LoaderComponent } from './commons/components/loader/loader.component';
import { LoaderService  } from './commons/services/loader/loader.service';
import { LoaderInterceptor } from './helpers/loader.interceptor';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { ReportsComponent } from './components/reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    UserComponent,
    BranchesComponent,
    BranchComponent,
    CategoriesComponent,
    CategoryComponent,
    ItemsComponent,
    ItemComponent,
    OrdersComponent,
    CreateOrderComponent,
    OrderDetailsComponent,
    ContactUsComponent,
    GridFilterPipe,
    CreateBranchComponent,
    LoaderComponent,
    CreateUserComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFontAwesomeModule,
    AlertModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200'],
        blacklistedRoutes: ['localhost:4200/auth/login']
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor,multi:true},
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true},
    LoaderService, 
    BranchService,
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateBranchComponent,
    CreateUserComponent,
    CategoryComponent
  ]
})
export class AppModule { }

export function tokenGetter(){
  return localStorage.getItem('d-epos-user');
}
