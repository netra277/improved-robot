const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const  { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const config = require('../configuration/config');
const User = require('../models/users');

// Json web token strategy
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.jwtSecretKey
}, async (payload, done)=>{
try{
// Find the user specified in token 
const user = await User.findById(payload.sub);
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
//find the user with the given email
const user = await User.findOne({username});
// if  not found, return user
if(!user){
    return done(null,false);
}
// check if the password is correct
const isMatch = await user.isValidPassword(password);
// if not handle it
if(!isMatch){
    return done(null,false);
}

return done(null,user);
    }catch(error){
        done(null, false);
    }
}))