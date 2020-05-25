const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');

module.exports = {
    getCollectedAmountReport: async(req, res, next)=>{
        const reqUser = req.user;
        if(reqUser.role.role ===  rolesList.Manager){
            // should get all users collected amount report
            const BranchUser =  model.getBranchUserModel(reqUser.clientId.clientId);
            const branchUser = BranchUser.findOne({userIds: reqUser._id});
            console.log('branchUser: ', branchUser);
            const Orders = model.getOrdersModel(reqUser.clientId.clientId);
            const orders = Orders.find({branchId: branchUser.branchId});
            const cashOrderCount = Orders.where('paymentDetails.mode').equals('cash').count();
            console.log('cashOrderCount', cashOrderCount);

            

            //---
        }
        else if (reqUser.role.role ===  rolesList.User){
            const BranchUser =  model.getBranchUserModel(reqUser.clientId.clientId);
            const branchUser = BranchUser.findOne({userIds: reqUser._id});
            console.log('branchUser: ', branchUser);
            const Orders = model.getOrdersModel(reqUser.clientId.clientId);
            const orders = Orders.find({branchId: branchUser.branchId});
            const cashOrderCount = await Orders.where('paymentDetails.mode').equals('creditcard').count();
            console.log('cashOrderCount', cashOrderCount);
            const groupedOrders = await Orders.aggregate([
                {
                    $group: {
                        _id: '$paymentDetails.mode',
                        totalAmount: {$sum: "$paymentDetails.amount"}
                    }
                }
            ]);
            console.log('groupedorders: ', groupedOrders);
            return res.status(200).json(cashOrderCount);
        }
    }
}