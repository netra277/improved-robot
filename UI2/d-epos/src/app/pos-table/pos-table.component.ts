import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from './product';
import { ProductService } from '../services/product.service';
import { MenuItem } from 'primeng/api';
import { CartService } from '../services/cart.service';
import { Cart } from '../Models/cart';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-pos-table',
  templateUrl: './pos-table.component.html',
  styleUrls: ['./pos-table.component.css']
})
export class PosTableComponent implements OnInit {
  items: MenuItem[] = [];
  cart: Cart;
  totaldiscount: number;
  totalamount: number;
  totalquantity: number;
  clonedProducts: { [s: string]: Product; } = {};
  productDialog: boolean;
  cartComm: Observable<any> = new Observable<any>();

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cartService: CartService
  ) {

    this.cartComm.subscribe(res => {
      if (res.msgType === 'cartItemAdded') {
        this.cart = res.obj;
      }
    });
  }

  ngOnInit() {
    this.cart = this.cartService.initCart();
  }

  onRowEditInit(product: Product) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(product: Product) {
    if (product.price > 0) {
      delete this.clonedProducts[product.id];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    this.cart[index] = this.clonedProducts[product.id];
    delete this.clonedProducts[product.id];
  }

  deleteProduct(product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartService.deleteCartItem(product);
        delete this.clonedProducts[product.id];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });

  }

  hideDialog() {
    this.productDialog = false;
  }

}
