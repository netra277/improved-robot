const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const constants = require('../constants/enums');

module.exports = {
    getOrders: async (req, res, next) => {
        const usr = req.user;
        const Branch = model.getBranchModel(usr.ClientNumber);
        const Order = model.getOrdersModel(usr.ClientNumber);
        const orders = await Order.find().populate('BranchId');
        return res.status(200).json(orders);
    },
    getOrder: async (req, res, next) => {
        const usr = req.user;
        const Branch = model.getBranchModel(usr.ClientNumber);
        const Order = model.getOrdersModel(usr.ClientNumber);
        const order = await Order.findById(req.params.id).populate('BranchId');
        if (order) {
            return res.status(200).json(order);
        } else {
            return res.status(204).json({
                message:{
                    detail: 'no order found'
                } 
            });
        }
    },
    create: async (req, res, next) => {
        const usr = req.user;
        const reqData = req.body;
        console.log('In create order...',usr.ClientNumber);
        const Order = model.getOrdersModel(usr.ClientNumber);
        const orderNo = Order.find().countDocuments() + 1;
        const fullorderno = pad_with_zeroes(orderNo,4);
         const invoiceNo = usr.ClientNumber.substring(0,4) + fullorderno;
         
        const order = new Order({
            OrderNumber: orderNo,
            InvoiceNumber: invoiceNo,
            OrderedDateTime: Date.now(),
            PaymentDetails: {
                TotalAmount: '',
                DiscountPercentage: '',
                DiscountAmount: '',
                AmountAfterDiscount: '',
                ModeOfPayment: '',
                Particulars: { }
            },
            BranchId: reqData.branch_id,
            CreatedByUserId: req.user._id,
            ItemsList : reqData.items,
            CustomerDetails: reqData.customer_details,
            OrderType: reqData.order_type,
            Status: orderstatuses.WalkinStatus.Completed
        });
        console.log('beforesave: ');
        const b = await order.save();
        if (b) {
            return res.status(200).json({
                message: 'order created successfully',
                OrderId: orderNo,
                InvoiceNumber: invoiceNo
            });
        }
        else {
            return res.status(500).json({
                message: 'error in creating order'
            });
        }
    },
    update: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser) {
            clientId = req.value.body.clientId;
        }
        else if (role === rolesList.Admin) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Item = model.getItemsModel(clientId);
        const item = await Item.findById(req.value.params.id);
        if (!item) {
            return res.status(404).json({
                message: 'item doesnot exist'
            });
        } else {
            if (req.value.body.name && req.value.body.name !== '') {
                item.name = req.value.body.name;
            }
            if (req.value.body.description && req.value.body.description !== '') {
                item.description = req.value.body.description;
            }
            if(req.value.body.categoryId && req.value.body.categoryId !== ''){
                const Category = model.getCategoryModel(clientId);
                item.categoryId = Category.findById(req.value.body.categoryId);
            }
            if(req.value.body.price && req.value.body.price !== ''){
                item.price = req.value.body.price;
            }
            const itemUpdated = await Item.updateOne({ _id: req.value.params.id }, item);
            if (itemUpdated.nModified > 0) {
                return res.status(200).json({
                    message: 'Item updated successfully'
                });
            }
            return res.status(500).json({
                message: 'error updating item'
            });
        }
    },
    delete: async (req,res,next)=>{
        const usr = req.user;
        const Order = model.getOrdersModel(usr.ClientNumber);
        const order = await Order.findById({ _id: req.params.id });
        if (!order) {
            return res.status(404).json({
                message: 'order id doesnot exist'
            });
        } else {
            const resp = await Order.remove({ _id: req.params.id });
            if (resp.deletedCount > 0) {
                    return res.status(200).json({
                        message: 'order deleted successfully'
                    });
            }
            return res.status(500).json({
                message: 'error deleting order'
            });
        }
    }

};

pad_with_zeroes = (number, length) => {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}