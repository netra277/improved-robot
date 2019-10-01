const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const Schema = mongoose.Schema;

// Create branch user schema

const BranchUserSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    branchId: {
        type: String
    },
    userId: {
        type:String
    },
    isDefaultBranch:{
        type: String
    },
    role: {
        type:String
    }
},{collection:collections.ClientDbCollections.BranchUserDetails});

module.exports = BranchUserSchema;