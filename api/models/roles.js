const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const Schema = mongoose.Schema;

// Create a roles schema

const RoleSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    roleId:{
        type: Number,
        required:[true,'Role id is required']
    },
    role:{
        type: String,
        required:[true,'Role is required']
    },
    description:{
        type: String
    },
    levelId:{
        type: Number,
        required: true
    },
    isClientLevel:{
        type: Boolean,
        required: true
    }
},{collection:collections.Roles});

module.exports = RoleSchema;