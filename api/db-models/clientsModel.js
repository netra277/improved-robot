const mongoose = require('mongoose');
const collections = require('../constants/db-collections');
const Schema = mongoose.Schema;

// Create a client schema

const ClientSchema = new Schema({
    ClientId: {
        type: String,
        required: [true, 'Client id is required'],
        minlength: 6,
        maxlength: 6,
        uppercase: true
    },
    Name: {
        type: String,
        required: [true, 'Client name is required']
    },
    ClientKey: {
        type:String,
        required: true
    },
    Address: {
        type: String
    },
    Phone: {
        type: Number,
        unique: true
    },
    Status: {
        type: String,
        enum: ['active', 'inactive', 'subscribed', 'unsubscribed'],
        required: true,
        default: 'inactive'
    },
    Email: {
        type: String,
        required: true
    },
    SubscribedDate: {
        type: Date,
        default: Date.now
    },
    UnSubscribedDate:{
        type: Date
    },
    DevicesRegistered: {
        type: Number
    },
    IsLocked:{
        type: Boolean,
        default: false
    },
    SubscribedTillDate:{
        type: Date
    },
    IsActive: {
        type: Boolean,
        default: false
    },
    ActivatedDate: {
        type: Date
    }

}, { collection: collections.Clients });


module.exports = ClientSchema;