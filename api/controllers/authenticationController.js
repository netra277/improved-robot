const jwt = require('jsonwebtoken');
const config = require('../configuration/config');
const 

signToken = user => {
    return token = jwt.sign({
        user: {
            id: user._id,
            clientId: user.clientId,
            username: user.username,
            role: user.role.role
        },
        iss: 'd-epos',
        sub: user.id,
        iat: new Date().getDate(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, config.jwtSecretKey);
}

module.exports = {
    loginAdmin: async (req, res, next) => {
        //const token = signToken(req.user);
        const reqData = req.body;
        console.log('user login success: ', reqData.device_id);
        if(!reqData.device_id || reqData.device_id === '' ){
            
        }
        return res.status(200).json({ token });
    },
    loginUser: async (req, res, next) => {
        //const token = signToken(req.user);
        console.log('user login success: ', req.user.username);
        res.status(200).json({ token });
    },
    roleAuthorization: (roles) => {
        return function (req, res, next) {
            var foundUser = req.user;
            console.log('roles:',roles);
            if(foundUser.role.role === rolesList.SuperUser){
                console.log('Has access for role:',foundUser.role.role);
                return next();
            }
            else if (roles.indexOf(foundUser.role.role) > -1) {
                console.log('Has access for role:',foundUser.role.role);
                return next();
            }
            console.log('Not authorized for role: ', foundUser.role.role);
            return res.status(401).json({ message: 'You are not authorized to view this content' });
        }
    }
}

// private methods

getDeviceDetails= (deviceId) =>{
    
}