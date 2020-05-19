const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const collections = require('../constants/db-collections');
const mongooModel = require('../constants/mongoose-models');
const Schema = mongoose.Schema;

//create a schema
const adminUserSchema = new Schema({
    Username: {
        type: String,
        required: true,
        // unique: true,
        uppercase: true,
        maxlength: 12
    },
    Password: {
        type: String,
        required: true
    },
    ClientId: {
        type: String,
           required: true
    },
    ClientKey: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    BirthYear: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Email: {
        type: String
    },
    NumberOfDevices: { 
        type: Number,
        required: true
    },
    Phone: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    RequiredPasswordChange: {
        type: Boolean,
        required: true
    }
},{collection:collections.AdminUsers});
adminUserSchema.pre('save', async function(next) {
 try{
     // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash 
    const PasswordHash = await bcrypt.hash(this.Password,salt);
    this.Password = PasswordHash;
    next();
 }catch(error){
     next(error);
 }
});
adminUserSchema.pre('updateOne', async function(next) {
    try{
        // Generate a salt
       const salt = await bcrypt.genSalt(10);
       // Generate a password hash 
       const PasswordHash = await bcrypt.hash(this._update.Password,salt);
       this._update.Password = PasswordHash;
       next();
    }catch(error){
        next(error);
    }
   });

adminUserSchema.methods.isValidPassword = async function(newpassword){
    try{
      return await bcrypt.compare(newpassword,this.Password);
    }catch(err){
        throw new Error(err);
    }
}
//create a model
//const User = mongoose.model('user-a',userSchema);
//export the model
module.exports = adminUserSchema;