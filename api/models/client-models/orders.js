const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const mongooModel = require('../../commons/mongoose-models');
const Schema = mongoose.Schema;

// Create order schema

const OrderSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    orderNumber: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    orderedDateTime:{
        type: String,
        required: true
    },
    branchId:{
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.BranchesModel,
           required: true
    },
    totalAmount:{
        type: Number,
        required: true
    },
    discountAmount:{
        type: Number,
        required: true
    },
    amountAfterDiscount:{
        type: Number,
        required: true
    },
    paymentType:{
        type: String,
        enum: ['cash', 'debitcard', 'creditcard', 'upi'],
        required: true
    },
    orderCreatedByUser:{
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.UsersModel,
           required: true
    },
    cardOrCashDetails: {
        type: String
    }
},{collection:collections.ClientDbCollections.Orders_Daily});

module.exports = OrderSchema;