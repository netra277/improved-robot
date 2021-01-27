import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../Models/cart';
import { Bill } from '../pos-table/bill';

import { Product } from '../pos-table/product';

@Injectable()
export class ProductService {
    products: Product[] = [];

    constructor(
    ) { }

    getProducts() {
        this.products = [
            { name: 'Chicken Tikka Masala', price: 350, code: '1', category: 'Curries', discount: 10, inCart: false, quantity: 1 },
            { name: 'Rumali Roti', price: 30, code: '2', category: 'Bread', discount: 10, inCart: false, quantity: 1 },
            { name: 'Butter Naan', price: 30, code: '3', category: 'Bread', discount: 10, inCart: false, quantity: 1 },
            {
                name: 'Chicken Chettinad Chennai Chicken', price: 350, code: '4', category: 'Curries', discount: 10,
                inCart: false, quantity: 1
            },
            { name: 'Paneer Butter Masala', price: 300, code: '5', category: 'Curries', discount: 10, inCart: false, quantity: 1 },
            { name: 'Chicken Tikka Kebab', price: 350, code: '6', category: 'Kebab', discount: 10, inCart: false, quantity: 1 },
            { name: 'Dal Tadka', price: 200, code: '7', category: 'Curries', discount: 10, inCart: false, quantity: 1 },
            { name: 'Bagara Rice', price: 200, code: '8', category: 'Biryani', discount: 10, inCart: false, quantity: 1 },
            { name: 'Upma', price: 75, code: '9', category: 'Tiffin', discount: 10, inCart: false, quantity: 1 },
            { name: 'Dosa', price: 70, code: '10', category: 'Tiffin', discount: 10, inCart: false, quantity: 1 },
            { name: 'Idli', price: 50, code: '11', category: 'Tiffin', discount: 10, inCart: false, quantity: 1 },
            { name: 'Kaaram Idli', price: 65, code: '12', category: 'Tiffin', discount: 10, inCart: false, quantity: 1 },
            { name: 'Pesarattu', price: 75, code: '13', category: 'Tiffin', discount: 10, inCart: false, quantity: 1 },
            { name: 'Chicken Biryani', price: 250, code: '14', category: 'Biryani', discount: 10, inCart: false, quantity: 1 },
            { name: 'Chicken 65', price: 300, code: '15', category: 'Starters', discount: 10, inCart: false, quantity: 1 }
        ];
        this.updateAmounts();
        return this.products;
    }

    updateAmounts() {
        this.products.forEach(x => {
            x.amount = (x.price * x.quantity) - x.discount;
        });
        return this.products;
    }

    // addProductToCart(product: Product) {
    //     this.cartService.addCartItem(product);
    // }
}
