const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const Schema = mongoose.Schema;

// Create branch schema

const BranchSchema =  new Schema({
    branchId: {
        type: String,
        required: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    isHeadBranch: {
        type: Boolean,
        required: true
    },
    printInvoice: {
        type: Boolean,
        required: true
    },
    tax: {
        type: []
    },
},{collection:collections.ClientDbCollections.Branch});

module.exports = BranchSchema;