const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const Schema = mongoose.Schema;

// Create a client schema

const ClientSchema = new Schema({
    ID:{
        type: String,
        required:[true,'Client id is required'],
        unique:true,
        minlength:6,
        maxlength:6
    },
    Name:{
        type: String,
        required:[true,'Client name is required']
    },
    Description:{
        type: String
    },
    Phone:{
        type: Number,
        required: function(){
            this.Email === undefined || this.Email === null;
        },
        minlength:10,

    },
    Email:{
        type: String,
        required: function(){
            this.Phone === undefined || this.Phone === null;
        }
    },
    Address:{
        type: String
    },
    Status:{
        type:String,
        enum:['active','inactive','suspended'],
        required: true,
        default: 'inactive'
    },
    RegisteredDate:{
        type: Date,
        required: true
    },
    UnRegisteredDate:{
        type: Date
    }
},{collection:collections.Clients});

module.exports = ClientSchema;