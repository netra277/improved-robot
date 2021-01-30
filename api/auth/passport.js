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
passport.use('StratLoginAdmin', new LocalStrategy({
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
            return done({message:{detail: 'no user found'}}, false);
        }
        if (user.Status!== constants.AdminUserStatus.Active || user.IsLocked) {
            console.log('user is inactive');
            return done({message:{detail: 'user is inactive'}}, false);
        }
        if (user.RequiredPasswordChange) {
            console.log('required password change');
            return done({
                message: {
                    detail:'required password change',
                    requiredChange: true
                }
            }, false);
        }
        // check if the password is correct
        const isMatched = await user.isValidPassword(password);
        console.log('password match: ', isMatched);

        if (!isMatched) {
            return done({message:{detail: 'password does not match'}}, false);
        }
        user.role = await getUserRole(user.RoleId);
        return done(null, user);
    } catch (error) {
        done(null, false);
    }
}));

// local strategy
passport.use('StratLoginUser', new LocalStrategy({passReqToCallback: true }, async (req, username, password, done) => {
    console.log('user strategy:',req.body);
    try {
        const reqData = req.body;
        if(!reqData.device || reqData.device === ''){
            console.log('device not registered for user: ',reqData.username);
            return done({message:{detail:'invalid device details'}},false);
        }
        const ClientDevice = conn.getClientDevicesModel();
        const cDevice = await ClientDevice.findById(reqData.device);
        if(!cDevice){
            console.log('Invalid device id for user: ',reqData.username);
            return done({ message:{detail: 'Invalid device details' }},false);
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

passport.use('admindevicesjwt',new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.jwtSecretKey
}, async (payload, done) => {
    try {
        console.log('tokendetails', payload);
        if(!payload.user || !payload.user.role || !payload.user.role.id || payload.user.role.id === ''){
            return done({message: {detail:'Invalid roleId'}}, false);
        }
        console.log('getting admin details',payload.user.role.id);
        const role = await Role.findById(payload.user.role.id);
        if(!role){
            return done({message: {detail:'Invalid role details'}},false );
        }
        if(role.Role === constants.Roles.ADMIN){
            const user = await AdminUser.findById(payload.user.id);
            if(!user){
               return done({message: {detail: 'Invalid admin details'}},false );
            }
            user.role = role.Role;
           return  done(null,user);
        }  
        return done(null,false);
    } catch (err) {
        return done(err, false);
    }
}));

// Json web token strategy
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.jwtSecretKey,
    passReqToCallback: true
}, async (req, payload, done) => {
    try {
        console.log('tokendetails', payload);
        const headerDeviceId = req.headers['device_id'];
        console.log('getting admin details and deviceid',headerDeviceId);
        if(!payload.user || !payload.user.role || !payload.user.role.id || payload.user.role.id === '' 
            || !headerDeviceId || headerDeviceId === '' || !payload.user.deviceId){
            return done({message:{detail: 'Invalid request'}}, false);
        }
        const role = await Role.findById(payload.user.role.id);
        if(!role){
            return done({message: {detail:'Invalid role details'}},false );
        }
        if(role.Role === constants.Roles.ADMIN){
            const user = await AdminUser.findById(payload.user.id);
            if(!user){
                return done({message:{detail: 'Invalid admin details'}},false );
            }
            console.log('devid',payload.user.deviceId);
            const clidev = await ClientDevices.findOne({DeviceId: payload.user.deviceId, Status: constants.DeviceStatus.Active});
            console.log('b:',clidev._id);
            if(!clidev || headerDeviceId.toString() !== clidev._id.toString()){
                return done({message: {detail: 'device doesnot exist or not activated'}},false );
            }
            console.log('adding role');
            user.role = role.Role;
            console.log('added role',user);
            user.DeviceId = payload.user.deviceId;
            console.log('clientnumber');
            user.ClientNumber = clidev.ClientNumber;
            return done(null,user);
        }   
        else{
            if(!payload.user.deviceId || payload.user.deviceId === ''){
                return done({message:{detail: 'Invalid deviceId'}},false);
            }
            const clidev = await ClientDevices.findOne({DeviceId: payload.user.deviceId, Status: constants.DeviceStatus.Active});
            if(!clidev || headerDeviceId !== clidev._id){
                return done({message:{detail: 'device doesnot exist or not activated'}},false );
            }
            const User = model.getUserModel(clidev.ClientNumber);
            const user = await User.findById(payload.user.id);
            if(!user){
                return done({message:{detail: 'Invalid user details'}},false );
            }
            user.ClientNumber = clidev.ClientNumber;
            if(user.RoleId !== payload.user.role.id){
                return done({message:{detail: 'Invalid role details'}}, false)
            }
            user.role = await Role.findById(user.RoleId).RoleName;
            user.DeviceId = payload.user.deviceId;
            done(null,user);
        }
        done({message:{detail: 'no user found'}},false);
    } catch (err) {
        done(err, false);
    }
}));



// private methods

getUserRole = async (roleId) => {
    if(!roleId){
        return null;
    }
    console.log('roleid',roleId);
    const rol = await Role.findById(roleId);
    if (rol) {
        return {
            id: rol._id,
            name: rol.RoleName
        };
    }
    return null;
}
