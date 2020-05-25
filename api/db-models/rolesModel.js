const mongoose = require('mongoose');
const collections = require('../constants/db-collections');
const Schema = mongoose.Schema;

// Create a roles schema

const RoleSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    RoleId:{
        type: Number,
        required:[true,'Role id is required']
    },
    Role:{
        type: String,
        required:[true,'Role is required'],
        uppercase: true
    },
    RoleName: {
        type: String,
        required: true
    },
    Description:{
        type: String
    },
    IsClientLevel:{
        type: Boolean,
        required: true,
        default: true
    }
},{collection:collections.Roles});


module.exports = RoleSchema;