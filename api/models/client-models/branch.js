const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const Schema = mongoose.Schema;

// Create branch schema

const BranchSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    branchId: {
        type: String,
        uppercase: true
    },
    name: {
        type:String
    },
    Address: {
        type: String
    },
    phone:{
        type: Number
    },
    email:{
        type: String
    },
    GSTNumber: {
        type: String
    },
    TaxPercentage:{
        type: Number
    },
    isHeadBranch: {
        type: Boolean
    }
},{collection:collections.ClientDbCollections.Branch});

module.exports = BranchSchema;