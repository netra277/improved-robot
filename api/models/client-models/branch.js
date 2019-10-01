const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
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
    parentId: {
        type:String
    },
    Address: {
        type: String
    },
    GSTNumber: {
        type: String
    },
    isHeadBranch: {
        type: String
    }
},{collection:collections.ClientDbCollections.Branch});

module.exports = BranchSchema;