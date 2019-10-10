const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const mongooModel = require('../../commons/mongoose-models');
const Schema = mongoose.Schema;

// Create Items schema

const ItemSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    itemCode: {
        type: String
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModel.CategoryModel
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
    itemImage: {
        type:String
    }
},{collection:collections.ClientDbCollections.Items});

module.exports = ItemSchema;