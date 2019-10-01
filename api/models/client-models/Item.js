const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const Schema = mongoose.Schema;

// Create Items schema

const ItemSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    itemId: {
        type: String
    },
    name: {
        type:String
    },
    description:{
        type: String
    },
    price: {
        type:String
    },
    itemCode: {
        type:String
    },
    itemImage: {
        type:String
    }
},{collection:collections.ClientDbCollections.Items});

module.exports = ItemSchema;