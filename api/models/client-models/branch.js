const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const Schema = mongoose.Schema;

// Create branch schema

const BranchSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    branchId: {
        type: String
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
    isHeadBranch: {
        type: Boolean
    }
},{collection:collections.ClientDbCollections.Branch});

module.exports = BranchSchema;