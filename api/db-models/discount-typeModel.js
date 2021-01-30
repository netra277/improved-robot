const mongoose = require('mongoose');
const collections = require('../constants/db-collections');
const Schema = mongoose.Schema;

// Create a Discount type schema

const DiscountTypeSchema = new Schema({
    Id:{
        type: Number,
        required:[true,'Role id is required']
    },
     
    DiscountType: {
        type: String,
        enum: ['amount', 'percent'],
        required: true
    },
    Description:{
        type: String
    }
},{collection:collections.Roles});


module.exports = RoleSchema;