const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const config = require('../configuration/config');
const conn = require('../dbconnections/connection_initializer');
const constants = require('../constants/enums');
const AdminUser = conn.getAdminUserModel();
const Role = conn.getRoleModel();

// admin strategy 
passport.use('StratAdmin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    console.log('admin strategy');
    try {
        //find the user with the given username
        const user = await AdminUser.findOne({ Username: username });
        // if  not found, return user
        if (!user) {
            console.log('no user found');
            return done(null, false);
        }
        // check if the password is correct
        const isMatched = await user.isValidPassword(password);
        console.log('password match: ', isMatched);

        user.role = getUserRole(true);

        if (!isMatched) {
            return done(null, false);
        }
        return done(null, user);

    } catch (error) {
        done(null, false);
    }
}));


// Json web token strategy
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.jwtSecretKey
}, async (payload, done) => {
    try {
        const Role = conn.getRoleModel();
        const usr = conn.getUserModel();
        // Find the user specified in token 
        console.log('userid: ', payload.sub);
        const user = await usr.findById(payload.sub);
        user.role = await Role.findById(user.role);
        const Client = conn.getClientModel();
        user.clientId = await Client.findById(user.clientId);

        //If user doesn't exists, retrun user
        if (!user) {
            return done(null, false);
        }
        // otherwise, return user
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));



// local strategy
passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    console.log('localstrategy');
    try {
        const usr = conn.getUserModel();
        //find the user with the given username
        const user = await usr.findOne({ username });
        // if  not found, return user
        if (!user) {
            console.log('no user found');
            return done(null, false);
        }

        // check if the password is correct
        const isMatch = await user.isValidPassword(password);
        console.log('password match: ', isMatch);
        // if not handle it
        const Role = conn.getRoleModel();
        user.role = await Role.findById(user.role);

        if (!isMatch) {
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        done(null, false);
    }
}));


// private methods

getUserRole = async (isAdmin) =>{
    if(isAdmin){
        const rol = await Role.findOne({ Role: constants.Roles.ADMIN });
        return {
            id: rol._id,
            name: rol.RoleName
        };
    }
}