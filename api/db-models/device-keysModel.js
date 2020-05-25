const mongoose = require('mongoose');
const collections = require('../constants/db-collections');
const Schema = mongoose.Schema;

// Create a  schema

const DeviceKeysSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    ClientId:{
        type: mongoose.Schema.Types.ObjectId,
        required:[true,'Client id is required']
    },
    GeneratedDeviceKey:{
        type: String,
        required:true
    },
    ExpireTime: {
        type: Date,
        required: true
    }
},{collection:collections.DeviceKeys});


module.exports = DeviceKeysSchema;