const mongoose = require('mongoose');
const collections = require('../../commons/db-collections');
const mongooModel = require('../../commons/mongoose-models');
const Schema = mongoose.Schema;

// Create branch user schema

const BranchUserSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModel.BranchesModel,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModel.UsersModel,
        required: true
    }
},{collection:collections.ClientDbCollections.BranchUserDetails});

module.exports = BranchUserSchema;