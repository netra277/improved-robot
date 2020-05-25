const mongoose = require('mongoose');
const collections = require('../constants/db-collections');
const mongooModels = require('../constants/mongoose-models');
const Schema = mongoose.Schema;

// Create a  schema

const ClientDeviceSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    DeviceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModels.DevicesModel,
        required:[true,'Device id is required'],
        unique: true
    },
    ClientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModels.ClientsModel,
        required:true
    },
    ClientNumber:{
        type: String,
        required: true
    }
},{collection:collections.ClientDevices});


module.exports = ClientDeviceSchema;