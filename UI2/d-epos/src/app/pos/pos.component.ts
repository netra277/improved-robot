import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
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
  selectedProducts: Product[] = [];

  selectedCityCode: string;
  constructor(
    private primengConfig: PrimeNGConfig,
    private productService: ProductService,
    private cartService: CartService) {
    this.products = this.productService.getProducts();
  }

  ngOnInit(): void {
  }

  addToCart(productId) {
    console.log(this.selectedProducts);
    // mark the product item as disabled as it will be added to cart
    this.products.find(x => x.code === productId).inCart = true;
    this.cartService.addCartItem(this.products.find(x => x.code === productId));
  }


}
