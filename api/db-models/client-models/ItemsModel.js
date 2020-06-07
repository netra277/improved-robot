const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const mongooModel = require('../../constants/mongoose-models');
const Schema = mongoose.Schema;

// Create Items schema

const ItemSchema =  new Schema({
    ItemCode: {
        type: String,
        required: true,
        uppercase: true
    },
    CategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModel.CategoriesModel,
    },
    Name: {
        type:String,
        required: true
    },
    Description:{
        type: String
    },
    Price: {
        type:Number,
        required: true
    },
    ItemImage: {
        type:String
    }
},{collection:collections.ClientDbCollections.Items});

module.exports = ItemSchema;