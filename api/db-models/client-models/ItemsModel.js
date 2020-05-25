const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const mongooModel = require('../../constants/mongoose-models');
const Schema = mongoose.Schema;

// Create Items schema

const ItemSchema =  new Schema({
    itemCode: {
        type: String,
        required: true,
        uppercase: true
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModel.CategoriesModel,
    },
    name: {
        type:String,
        required: true
    },
    description:{
        type: String
    },
    price: {
        type:String,
        required: true
    },
    itemImage: {
        type:String
    }
},{collection:collections.ClientDbCollections.Items});

module.exports = ItemSchema;