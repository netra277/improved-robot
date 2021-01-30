import { Product } from '../pos-table/product';

export interface Cart {
    userId?: string;
    products: Product[];
    totalDiscount: number;
    totalAmount: number;
    totalQuantity: number;
}
