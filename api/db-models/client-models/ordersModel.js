const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const mongooModel = require('../../constants/mongoose-models');
const Schema = mongoose.Schema;

// Create order schema

const OrderSchema =  new Schema({
    OrderNumber: {
        type: Number,
        required: true
    },
    InvoiceNumber: {
        type: String,
        required: true
    },
    OrderedDateTime:{
        type: Date,
        required: true
    },
    PaymentDetails: {
        TotalAmount:{
            type: Number,
            required: true
        },
        DiscountPercentage: {
            type: Number,
            required: true
        },
        DiscountAmount:{
            type: Number,
            required: true
        },
        AmountAfterDiscount:{
            type: Number,
            required: true
        },
        ModeOfPayment:{
            type: String,
            enum: ['cash', 'debitcard', 'creditcard', 'upi'],
            required: true
        },
        Particulars: {
            type: {cash:{type: String}, debitcard: {type: String}, creditcard: {type: String}, upi: {type: String}}
        }
    },
    BranchId:{
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.BranchesModel,
           required: true
    },
    CreatedByUserId:{
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.UsersModel,
           required: true
    },
    ItemsList: [
        {
            ItemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: mongooModel.ItemsModel,
                required: true
            },
            Quantity: {
                type: Number,
                required: true
            },
            Amount: {
                type: Number
            }
        }
    ],
    CustomerDetails: {
        type: { name: {type: String},phone: {type: Number}, address: {type: String } }
    },
    OrderModified: {
        type: Boolean,
        default: false
    },
    ModifiedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.UsersModel,
    },
    OrderDeleted: {
        type: Boolean,
        default: false
    },
    OrderType: {
        type: String,
        enum: ['walkin', 'takeaway', 'homedeliver'],
        default: 'walkin'
    },
    OrderStatus: {
        type: String
    }
},{collection:collections.ClientDbCollections.Orders});

module.exports = OrderSchema;