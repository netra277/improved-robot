const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const Schema = mongoose.Schema;

// Create a roles schema

const DeviceSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    DeviceId:{
        type: String,
        required:[true,'Device id is required'],
        unique: true
    },
    DeviceName:{
        type: String,
        required:[true,'Device Name is required']
    },
    DeviceActivatedOnIP: {
        type: String
    },
    ActivatedWithKey:{
        type: String
    },
    ActivatedDate:{
        type: Date
    },
    Status:{
        type: String
    },
    IsLocked: {
        type: Boolean,
        default: false
    },
    IsDeactivated: {
        type: Boolean,
        default: false
    },
    DeactivatedDate: {
        type: Date
    },
    ActivatedByUserId:{
        type: String
    }
},{collection:collections.ClientDbCollections.Devices});


module.exports = DeviceSchema;