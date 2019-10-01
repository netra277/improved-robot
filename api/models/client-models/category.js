const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const Schema = mongoose.Schema;

// Create category schema

const CategorySchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    categoryId: {
        type: String
    },
    name: {
        type:String
    },
    description:{
        type: String
    },
    parentId: {
        type:String
    }
},{collection:collections.ClientDbCollections.Category});

module.exports = CategorySchema;