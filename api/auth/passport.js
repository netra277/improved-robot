const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const  { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;


const config = require('../configuration/config');
const connection = require('../dbconnections/db_connection_common');
const mongooModels = require('../commons/mongoose-models');
const UserSchema = require('../models/users');

// Json web token strategy
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.jwtSecretKey
}, async (payload, done)=>{
try{
    const con =connection.connectToDatabase();
        const usr = con.model(mongooModels.UsersModel,UserSchema);
// Find the user specified in token 
const user = await usr.findById(payload.sub);
//If user doesn't exists, retrun user
if(!user){
    return done(null,false);
}
// otherwise, return user
done(null,user);    
}catch(err){
    done(err,false);
}
}));



// local strategy
passport.use(new LocalStrategy({
    usernameField:'username'
},async (username,password,done)=>{
    try{
        const con =connection.connectToDatabase();
        const usr = con.model(mongooModels.UsersModel,UserSchema);
//find the user with the given username
const user = await usr.findOne({username});
// if  not found, return user
if(!user){
    console.log('no user found');
    return done(null,false);
}
// check if the password is correct
const isMatch = await user.isValidPassword(password);
console.log('password match: ',isMatch);
// if not handle it
if(!isMatch){
    return done(null,false);
}

return done(null,user);
    }catch(error){
        done(null, false);
    }
}))