import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { Product } from '../pos-table/product';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PosComponent implements OnInit {

  products: Product[] = [];
  inCartProducts: Product[] = [];
  cartComm: Observable<any> = new Observable<any>();

  selectedCityCode: string;
  constructor(
    private primengConfig: PrimeNGConfig,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.products = this.productService.getProducts();
    this.cartService.cartCommunication.subscribe(res => {
      if (res.msgType === ('cartItemDeleted')) {
        this.onCartItemDelete(res.obj);
      }
    });
  }

  ngOnInit(): void {

  }

  addToCart(productId) {
    const prodelem = this.products.findIndex(x => x.code === productId);
    this.products[prodelem].inCart = true;
    this.inCartProducts.push(this.products[prodelem]);
    this.cartService.addCartItem(this.products[prodelem]);
    this.products = this.products.filter(x => x.inCart !== true);
  }

  onCartItemDelete(productCode) {
    const prodelem = this.inCartProducts.findIndex(x => x.code === productCode);
    this.inCartProducts[prodelem].inCart = false;
    this.products.push(this.inCartProducts[prodelem]);
    this.products = this.products.filter(x => x.inCart !== true).sort((a, b) => (a.code > b.code) ? 1 : -1);
  }
}
