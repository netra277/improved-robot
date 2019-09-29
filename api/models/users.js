//const dbConnection = require('../dbconnections/db_connection_common');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const collections = require('../commons/db-collections');
const mongooModel = require('../commons/mongoose-models');
const Schema = mongoose.Schema;

//create a schema
const userSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required:true,
        unique: true
    },
    clientId: {
          type: mongoose.Schema.Types.ObjectId,
           ref: mongooModel.ClientsModel,
           required: true
    },
    name: {
        type: String,
        required: true
    },
    createdDate: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    lastLogin: {
        type: String
    },
    role: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: mongooModel.RolesModel, 
        required: true
    },
    status: {
        type: String,
        required: true
    }
},{collection:collections.Users});
userSchema.pre('save', async function(next) {
 try{
     // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash 
    const PasswordHash = await bcrypt.hash(this.password,salt);
    this.password = PasswordHash;
    next();
 }catch(error){
     next(error);
 }
});

userSchema.methods.isValidPassword = async function(newpassword){
    try{
      return await bcrypt.compare(newpassword,this.password);
    }catch(err){
        throw new Error(err);
    }
}
//create a model
//const User = mongoose.model('user-a',userSchema);
//export the model
module.exports = userSchema;