const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const Schema = mongoose.Schema;

// Create category schema

const CategorySchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    categoryId: {
        type: String,
        uppercase: true
    },
    name: {
        type: String
    },
    description:{
        type: String
    }
},{collection:collections.ClientDbCollections.Category});

module.exports = CategorySchema;