const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const Schema = mongoose.Schema;

// Create category schema

const CategorySchema =  new Schema({
    categoryId: {
        type: String,
        uppercase: true
    },
    name: {
        type: String,
        required: true
    },
    description:{
        type: String
    }
},{collection:collections.ClientDbCollections.Category});

module.exports = CategorySchema;