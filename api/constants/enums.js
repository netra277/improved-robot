module.exports = {
    
    Roles: {
        ADMIN: 'ADMIN',
        STORE_SUPERVISOR: 'STORE_SUPERVISOR',
        MANAGER: 'MANAGER',
        USER: 'USER'
    },
    ClientStatus :{
        Active: 'active',
        Inactive: 'inactive',
        Subscribed: 'subscribed',
        Unsubscribed: 'unsubscribed'
    },
    UserStatus:{
        Active: 'active',
        Inactive: 'inactive'
    },
    PaymentTypes:{
        Cash: 'cash',
        DebitCard: 'debitcard',
        CreditCard: 'creditcard',
        UPI: 'upi',
        Cheque: 'cheque'
    },
    OrderType:{
        Walkin: 'walkin',
        TakeAway:'takeaway',
        Delivery:'delivery'
    },
    AdminUserStatus: {
        Created: 'created',
        Active: 'active',
        InActive: 'inactive'
    }
}