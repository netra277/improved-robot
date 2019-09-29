const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const Schema = mongoose.Schema;

// Create a client schema

const ClientSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    clientId:{
        type: String,
        required:[true,'Client id is required'],
        minlength:6,
        maxlength:6
    },
    name:{
        type: String,
        required:[true,'Client name is required']
    },
    description:{
        type: String
    },
    phone:{
        type: Number,
        required: function(){
            this.Email === undefined || this.Email === null;
        },
        minlength:10,

    },
    email:{
        type: String,
        required: function(){
            this.Phone === undefined || this.Phone === null;
        }
    },
    address:{
        type: String
    },
    status:{
        type:String,
        enum:['active','inactive','suspended'],
        required: true,
        default: 'inactive'
    },
    registeredDate:{
        type: Date,
        required: true
    },
    unregisteredDate:{
        type: Date
    }
},{collection:collections.Clients});

module.exports = ClientSchema;