const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const mongooModel = require('../../constants/mongoose-models');
const Schema = mongoose.Schema;

// Create branch user schema

const BranchUserSchema =  new Schema({
    _id: mongoose.Types.ObjectId,
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModel.BranchesModel,
        required: true
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModel.UsersModel
    }]
},{collection:collections.ClientDbCollections.BranchUserDetails});

module.exports = BranchUserSchema;