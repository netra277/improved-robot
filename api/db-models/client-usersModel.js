const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const collections = require('../constants/db-collections');
const mongooModels = require('../constants/mongoose-models');
const Schema = mongoose.Schema;

//create a schema
const clientUserSchema = new Schema({
    UserId: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        maxlength: 12
    },
    Password: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Email: {
        type: String
    },
    ClientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModels.ClientsModel,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    IsActive: {
        type: Boolean,
        required: true,
        default: false
    },
    RequiredPasswordChange: {
        type: Boolean,
        required: true,
        default: true
    },
    NoOfInvalidLogins: {
        type: Number,
        default: 0
    },
    CreatedDate: {
        type: Date,
    },
    RoleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModels.RolesModel,
        required: true
    },
    LastLoginDate: {
        type: Date
    },
    LastLoginIP: {
        type: String
    }
},{collection:collections.ClientUsers});

clientUserSchema.pre('save', async function(next) {
 try{
     this.UserId = this.UserId + this.Username;
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
clientUserSchema.pre('updateOne', async function(next) {
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

   clientUserSchema.methods.isValidPassword = async function(newpassword){
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