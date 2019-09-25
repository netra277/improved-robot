const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const Schema = mongoose.Schema;

// Create a roles schema

const RoleSchema = new Schema({
    ID:{
        type: Number,
        required:[true,'Role id is required'],
        unique:true
    },
    Role:{
        type: String,
        required:[true,'Role is required']
    },
    Description:{
        type: String
    },
    LevelId:{
        type: Number
    },
    isClientLevel:{
        type: Boolean
    }
},{collection:collections.Roles});

module.exports = RoleSchema;