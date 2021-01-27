import { Product } from './product';

export interface Bill {
    id?: string;
    customername?: string;
    totalamount?: number;
    totaldiscount?: number;
    products?: Product[];
}
