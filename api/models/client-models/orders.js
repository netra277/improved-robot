const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const mongooModel = require('../../commons/mongoose-models');
const Schema = mongoose.Schema;

// Create order schema

const OrderSchema =  new Schema({
    orderNumber: {
        type: Number,
        required: true
    },
    branchOrderNumber: {
        type: Number,
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
    paymentDetails: {
        amount:{
            type: Number,
            required: true
        },
        discountPercentage: {
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
        mode:{
            type: String,
            enum: ['cash', 'debitcard', 'creditcard', 'upi'],
            required: true
        },
        particulars: {
            type: {cash:{type: String}, debitcard: {type: String}, creditcard: {type: String}, upi: {type: String}}
        }
    },
    branchId:{
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.BranchesModel,
           required: true
    },
    createdByUserId:{
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.RegisteredUserModel,
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
                type: Number,
                required: true
            }
        }
    ],
    customerDetails: {
        type: { name: {type: String},phone: {type: Number}, address: {type: String } }
    }
},{collection:collections.ClientDbCollections.Orders});

module.exports = OrderSchema;