const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const mongooModel = require('../commons/mongoose-models');
const Schema = mongoose.Schema;

// Create order schema

const OrderDetailsSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    orderId: {
        type: String,
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.ItemsModel,
           required: true
    },
    quantity:{
        type: Number,
        required: true
    }
},{collection:collections.ClientDbCollections.Category});

module.exports = OrderDetailsSchema;