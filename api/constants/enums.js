module.exports = {
    
    Roles: {
        ADMIN: 'ADMIN',
        SUPERVISOR: 'SUPERVISOR',
        MANAGER: 'MANAGER',
        USER: 'USER'
    },
    ClientStatus :{
        Subscribed: 'subscribed',
        Active: 'active',
        Inactive: 'inactive',
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
    },
    DeviceStatus: {
        Created: 'created',
        Active: 'active',
        InActive: 'inactive'
    },
    DeviceKeyStatus: {
        Created: 'created',
        Active: 'active',
        Registered: 'registered',
        InActive: 'inactive'
    },
    OrderStatus:{
        WalkinStatus:{
            PaymentDoneButParked: 'parked',
            Completed:'completed',
            PaymentNotDone:'paymentnotdone'
        },
        TakeAwayStatus:{},
        DeliveryStatus:{}
    }
}