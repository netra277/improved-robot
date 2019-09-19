const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//create a schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});
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
const User = mongoose.model('user',userSchema);

//export the model
module.exports = User;