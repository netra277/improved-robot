
const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const mongooModel = require('../../commons/mongoose-models');
const Schema = mongoose.Schema;

//create a schema
const registeredUsersSchema = new Schema({
    username: {
        type: String,
        required: true,
        // unique: true,
        uppercase: true,
        minlength: 6,
        maxlength: 12
    },
    userId: {
        type: String,
        required:true,
        uppercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    createdDate: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    lastLogin: {
        type: String
    },
    role: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: mongooModel.RolesModel, 
        required: true
    },
    status: {
        type: String,
        required: true
    }
},{collection:collections.ClientDbCollections.RegisteredUsers}); 

module.exports = registeredUsersSchema;