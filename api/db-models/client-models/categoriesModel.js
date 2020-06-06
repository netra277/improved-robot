const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const Schema = mongoose.Schema;

// Create category schema

const CategorySchema =  new Schema({
    CategoryId: {
        type: String,
        uppercase: true
    },
    Name: {
        type: String,
        required: true
    },
    Description:{
        type: String
    },
    ParentCategoryId: {
        type: String,
        uppercase: true
    }
},{collection:collections.ClientDbCollections.Categories});

module.exports = CategorySchema;