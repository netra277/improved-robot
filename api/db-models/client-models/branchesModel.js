const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const Schema = mongoose.Schema;

// Create branch schema

const BranchSchema =  new Schema({
    BranchId: {
        type: String,
        required: true,
        uppercase: true
    },
    Name: {
        type: String,
        required: true
    },
    BranchCode: {
        type: String
    },
    Address: {
        type: String,
        required: true
    },
    Phone:{
        type: Number,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    IsHeadBranch: {
        type: Boolean,
        required: true
    },
    PrintInvoice: {
        type: Boolean,
        required: true,
        default: true
    },
    TaxesToPrint: {
        type: []
    },
    OverallTaxPercent: {
        type: Number
    }
},{collection:collections.ClientDbCollections.Branches});

module.exports = BranchSchema;