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

        if (!isMatched) {
            return done(null, false);
        }
        user.role = await getUserRole(user.RoleId);
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
        console.log('tokendetails', payload);
        if(!payload.user || !payload.role || !payload.role.id || payload.role.id === ''){
            return done(null, false);
        }
        const role = await Role.findById(payload.role.id);
        if(role.Role === constants.Roles.ADMIN){
            
        }
        // const Role = conn.getRoleModel();
        // const usr = conn.getUserModel();
        // // Find the user specified in token 
        // console.log('userid: ', payload.sub);
        // const user = await usr.findById(payload.sub);
        // user.role = await Role.findById(user.role);
        // const Client = conn.getClientModel();
        // user.clientId = await Client.findById(user.clientId);

        // //If user doesn't exists, retrun user
        // if (!user) {
        //     return done(null, false);
        // }
        // // otherwise, return user
        // done(null, user);
    } catch (err) {
        done(err, false);
    }
}));

// local strategy
passport.use('local', new LocalStrategy({passReqToCallback: true }, async (req, username, password, done) => {
    console.log('user strategy:',req.body);
    try {
        const reqData = req.body;
        if(!reqData.device || reqData.device === ''){
            console.log('device not registered for user: ',reqData.username);
            return done(null,false);
        }
        const ClientDevice = conn.getClientDevicesModel();
        const cDevice = await ClientDevice.findById(reqData.device);
        if(!cDevice){
            console.log('Invalid device id for user: ',reqData.username);
            return done(null,false);
        }
        const User = conn.getUserModel(cDevice.ClientNumber);
        //find the user with the given username
        const user = await User.findOne({ Username : reqData.username, RoleId:reqData.role });
        // if  not found, return user
        if (!user) {
            console.log('no user found');
            return done(null, false);
        }
        // check if the password is correct
        const isMatch = await user.isValidPassword(password);
        console.log('password match: ', isMatch);
        // if not handle it
        if (!isMatch) {
            return done(null, false);
        }
        
        user.role = await getUserRole(user.RoleId);

        return done(null, user);
    } catch (error) {
        done(null, false);
    }
}));

// private methods

getUserRole = async (roleId) => {
    if(!roleId){
        return null;
    }
    const rol = await Role.findById(roleId);
    if (rol) {
        return {
            id: rol._id,
            name: rol.RoleName
        };
    }
    return null;
}
