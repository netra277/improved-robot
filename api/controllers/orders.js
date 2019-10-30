const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');

module.exports = {
    getOrders: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        console.log('In getOrders', role);
        if (role === rolesList.Admin || role === rolesList.Supervisor || role === rolesList.Manager ||  role === rolesList.User) {
            console.log('role', role);
            clientId = req.user.clientId.clientId;
        }
        else {
            console.log('unauthorised');
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Order = model.getOrdersModel(clientId);
        const Item = model.getItemsModel(clientId);
        const registeredUsers = model.getRegisteredUsersModel(clientId);
        const Branch = model.getBranchModel(clientId);
        const orders = await Order.find()
            .populate('itemsList.itemId')
            .populate({path: 'createdByUserId', select: 'name'})
            .populate({path:'branchId', select:'name'});
        if (orders.length > 0) {
            var respOrders = {
                count: orders.length,
                orders: orders
            };
            return res.status(200).json(respOrders);
        } else {
            return res.status(204).json({
                message: 'no orders found'
            });
        }
    },
    getOrder: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser || role === rolesList.PowerUser) {
            clientId = req.value.body.clientId;
        }
        else if (role === rolesList.Admin || role === rolesList.Supervisor || role === rolesList.Manager) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Item = model.getItemsModel(clientId);
        const item = await Item.findById(req.value.params.id);
        if (item) {
            return res.status(200).json(item);
        } else {
            return res.status(204).json({
                message: 'no item found'
            });
        }
    },
    create: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.Admin || role === rolesList.Supervisor ||
                  role === rolesList.Manager || role === rolesList.User) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const today = new Date();
        let invoice = (today.getDate()).toString() + (today.getMonth() + 1).toString();
        const Order = model.getOrdersModel(clientId);
        const branchOrderCount = await Order.find({branchId: req.value.body.branchId }).count();
        const totalOrderCount = await Order.find({}).count();
        const order = new Order(req.value.body);
        order.orderNumber = totalOrderCount + 1;
        order.branchOrderNumber = branchOrderCount + 1;
        order.invoiceNumber =  invoice + order.branchOrderNumber;
        order.orderedDateTime = new Date().toISOString();
        console.log('order:',order);
        const ordr = await order.save();
        console.log('order',ordr);
        if (ordr) {
            console.log('Order created successfully');
            return res.status(200).json({
                message: 'Order created successfully'
            });
        }
        else {
            console.log('error in creating order');
        }

        
        // const OrderDetail = model.getOrderDetailsModel(clientId);
        // const itemslist = req.value.body.items;
        // let orderdetails = [];
        // let orderdetail = new OrderDetail();
        // itemslist.forEach((item)=>{
        //     orderdetail.itemId = item.itemId;
        //     orderdetail.orderId = o._id;
        //     orderdetail.quantity = item.quantity;
        //     orderdetails.push(orderdetail);
        // });
        // const ods = await OrderDetail.insertMany(orderdetails);
        // if(ods){
        //     return res.status(200).json({
        //         message: 'order created successfully'
        //     });
        // }else {
        //     return res.status(500).json({
        //         message: 'error in creating order'
        //     });
        // }
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
        const item =  await Item.findById(req.value.params.id);
        if (!item) {
            return res.status(404).json({
                message: 'item doesnot exist'
            });
        } else {
            const resp = await Item.remove({ _id: req.value.params.id });
            if (resp.deletedCount > 0) {
                return res.status(200).json({
                    message: 'item deleted successfully'
                });
            }
            return res.status(500).json({
                message: 'error deleting item'
            });
        }
    }
}