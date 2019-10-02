const jwt = require('jsonwebtoken');
const config = require('../configuration/config');
const rolesList = require('../auth/roles');

signToken = user => {
    return token = jwt.sign({
        user: {
            id: user._id,
            clientId: user.clientId,
            username: user.username
        },
        iss: 'd-epos',
        sub: user.id,
        iat: new Date().getDate(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, config.jwtSecretKey);
}

module.exports = {
    login: async (req, res, next) => {
        const token = signToken(req.user);
        console.log('user login success: ', req.user.username);
        res.status(200).json({ token });
    },
    roleAuthorization: (roles) => {
        return function (req, res, next) {
            var foundUser = req.user;
            if(foundUser.role.role === rolesList.SuperUser){
                console.log('Has access for role:',foundUser.role.role);
                return next();
            }
            else if (roles.indexOf(foundUser.role.role) > -1) {
                console.log('Has access for role:',foundUser.role.role);
                return next();
            }
            console.log('Not authorized for role: ', foundUser.role.role);
            res.status(401).json({ message: 'You are not authorized to view this content' });
            return next('Unauthorized');
        }
    }
}