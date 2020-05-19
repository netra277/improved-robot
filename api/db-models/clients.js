const mongoose = require('mongoose');
const collections = require('../constants/db-collections');
const Schema = mongoose.Schema;

// Create a client schema

const ClientSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    clientId: {
        type: String,
        required: [true, 'Client id is required'],
        minlength: 6,
        maxlength: 6,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Client name is required']
    },
    description: {
        type: String
    },
    phone: {
        type: Number,
        required: true,
        minlength: 10,

    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        required: true,
        default: 'inactive'
    },
    registeredDate: {
        type: Date,
        required: true
    },
    unregisteredDate: {
        type: Date
    }
}, { collection: collections.Clients });


module.exports = ClientSchema;