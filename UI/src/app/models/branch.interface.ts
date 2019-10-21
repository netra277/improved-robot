export interface Branch {
    _id: string;
    branchId: string;
    name: string;
    address: string;
    phone: number;
    email: string;
    printInvoice: boolean;
    isHeadBranch: boolean;
    tax:TaxValues[];
}

export interface TaxValues {
    key: string;
    value: string;
}