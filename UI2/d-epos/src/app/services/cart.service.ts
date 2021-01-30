import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cart } from '../Models/cart';
import { Product } from '../pos-table/product';

@Injectable()
export class CartService {
    cart: Cart;
    cartCommunication: Subject<any> = new Subject<any>();

    constructor() { }

    initCart() {
        this.cart = { products: [], totalAmount: 0, totalDiscount: 0, totalQuantity: 0 };
        if (localStorage.getItem('cartData') === null) {
            localStorage.setItem('cartData', JSON.stringify(this.cart));
        }
        return this.cart;
    }

    addCartItem(product: Product) {
        this.cart.products.push(product);
        this.updateBill();
        this.cartCommunication.next({ msgType: 'cartItemAdded', obj: this.cart });
    }

    updateCartItem(product: Product) {
        const elemIndex = this.cart.products.findIndex(elem => elem.code === product.code);
        this.cart.products[elemIndex] = product;
        this.updateBill();
        this.updateCart(this.cart);
        this.cartCommunication.next({ msgType: 'cartItemUpdated', obj: this.cart });
    }

    deleteCartItem(product: Product) {
        this.cart.products = this.cart.products.filter(val => val.code !== product.code);
        this.updateBill();
        this.updateCart(this.cart);
        this.cartCommunication.next({ msgType: 'cartItemDeleted', obj: product.code });
    }

    // update cart items methods to be written
    private updateCart(cartObj) {
        localStorage.setItem('cartData', JSON.stringify(cartObj));
    }

    private updateBill() {
        let totaldiscount = 0;
        let totalamount = 0;
        let totalquantity = 0;
        for (const pro of this.cart.products) {
            totalquantity += pro.quantity;
            totaldiscount += pro.discount;
            totalamount += pro.amount;
        }
        this.cart.totalAmount = totalamount;
        this.cart.totalDiscount = totaldiscount;
        this.cart.totalQuantity = totalquantity;
    }
}
