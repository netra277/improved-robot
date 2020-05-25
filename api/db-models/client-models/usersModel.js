
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const collections = require('../../constants/db-collections');
const mongooModel = require('../../constants/mongoose-models');
const Schema = mongoose.Schema;

//create a schema
const UsersSchema = new Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        minlength: 6,
        maxlength: 12
    },
    Password:{
        type: String
    },
    UserId: {
        type: String,
        required:true,
        uppercase: true,
        unique: true
    },
    Name: {
        type: String,
        required: true
    },
    CreatedDate: {
        type: Date,
        required: true
    },
    Phone: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    LastLogin: {
        type: String
    },
    RoleId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: mongooModel.RolesModel, 
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    IsLocked: {
        type: Boolean,
        default: false
    },
    NoOfInvalidLogins: {
        type: Number,
        default: 0
    },
    LastLoginIP:{ 
        type:String
    },
    BranchId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: mongooModel.BranchesModel
    }
},{collection:collections.ClientDbCollections.Users}); 
UsersSchema.pre('save', async function(next) {
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
   
   UsersSchema.methods.isValidPassword = async function(newpassword){
       try{
         return await bcrypt.compare(newpassword,this.Password);
       }catch(err){
           throw new Error(err);
       }
   }
module.exports = UsersSchema;