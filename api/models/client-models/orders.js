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
    invoice: {
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
    amount:{
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
    paymentMode:{
        type: String,
        enum: ['cash', 'debitcard', 'creditcard', 'upi'],
        required: true
    },
    orderCreatedByUserId:{
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.UsersModel,
           required: true
    },
    itemsList: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: mongooModel.ItemsModel,
                required: true
            },
            quantity: {
                type: Number
            }
        }
    ],
    paymentDetails: {
        type: { cash: {type: String }, debitCard: {type: String }, creditCard: {type: String }, upi: {type: String }}
    },
    customerDetails: {
        type: { name: {type: String},phone: {type: Number}, Address: {type: String } }
    }
},{collection:collections.ClientDbCollections.Orders});

module.exports = OrderSchema;