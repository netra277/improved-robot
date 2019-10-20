import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LoginComponent, UsersComponent, UserComponent, 
  BranchesComponent, BranchComponent, CategoriesComponent, 
  CategoryComponent, ItemsComponent, ItemComponent, 
  OrdersComponent, CreateOrderComponent, OrderDetailsComponent, ContactUsComponent } from './components';
import { BranchService } from './services';
import { GridFilterPipe } from './commons/pipes/grid-filter.pipe';


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
    GridFilterPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFontAwesomeModule,
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
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true},
    BranchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function tokenGetter(){
  return localStorage.getItem('d-epos-user');
}
