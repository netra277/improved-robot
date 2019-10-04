const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const Schema = mongoose.Schema;
const model = require('../dbconnections/connection_initializer');

// Create a roles schema

const RoleSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    roleId:{
        type: Number,
        required:[true,'Role id is required']
    },
    role:{
        type: String,
        required:[true,'Role is required'],
        lowercase: true
    },
    description:{
        type: String
    },
    isClientLevel:{
        type: Boolean,
        required: true
    }
},{collection:collections.Roles});


module.exports = RoleSchema;