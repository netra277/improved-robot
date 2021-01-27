import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { OrderListModule } from 'primeng/orderlist';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';

import { AppComponent } from './app.component';

import { SplitterModule } from 'primeng/splitter';
import { NavbarComponent } from './navbar/navbar.component';
import { PosComponent } from './pos/pos.component';
import { PosTableComponent } from './pos-table/pos-table.component';

import { ProductService } from './services/product.service';
import { PosToolbarComponent } from './pos-toolbar/pos-toolbar.component';
import { from } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { CartService } from './services/cart.service';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PosComponent,
    PosTableComponent,
    PosToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SplitterModule,
    HttpClientModule,
    TableModule,
    InputTextModule,
    MenubarModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    MessageModule,
    VirtualScrollerModule,
    OrderListModule,
    ScrollPanelModule,
    ConfirmDialogModule,
    ToastModule,
    InputNumberModule
  ],
  providers: [
    ProductService,
    MessageService,
    ConfirmationService,
    CartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
