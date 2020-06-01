const jwt = require('jsonwebtoken');
const config = require('../configuration/config');
const model = require('../dbconnections/connection_initializer');
const ClientDevice = model.getClientDevicesModel();

signToken = (user,branchdetails,deviceId) => {
    return token = jwt.sign({
        user: {
            id: user._id,
            deviceId: deviceId,
            username: user.username,
            role: user.role,
            branch: branchdetails
        },
        iss: 'd-epos',
        sub: user.id,
        iat: new Date().getDate(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, config.jwtSecretKey);
}

module.exports = {
    loginAdmin: async (req, res, next) => {
        let token = '';
        const reqData = req.body;
        console.log('user login success: ', req.user.role.id, reqData.role);
         
        if(!reqData.device || reqData.device === ''){
            token = signToken(req.user,null, null);
            return res.status(203).json({token});
        }
        const cdevice = await getDeviceDetails(req.user._id,reqData.device);
        token = signToken(req.user, null, cdevice.DeviceId);
        return res.status(200).json({ token });
    },
    loginUser: async (req, res, next) => {
        let token = '';
        const reqData = req.body;
        console.log('user login success: ', reqData.device);
        if(!reqData.device || reqData.device === ''){
            token = signToken(req.user,null, null);
            return res.status(203).json({token});
        }
        const cdevice = await getDeviceDetails(req.user._id,reqData.device);
        const branch = await getBranchDetails(req.user.BranchId,cdevice.ClientNumber);
        token = signToken(req.user, branch, cdevice.DeviceId);
        return res.status(200).json({ token });
    },
    roleAuthorization: (roles) => {
        return function (req, res, next) {
            var foundUser = req.user;
            if (roles.indexOf(foundUser.role) > -1) {
                console.log('Has access for role:',foundUser.role);
                return next();
            }
            console.log('Not authorized for role: ', foundUser.role);
            return res.status(401).json({ message: 'You are not authorized to view this content' });
        }
    }
}

// private methods

getDeviceDetails= async (deviceId) =>{
   const cliDevice = await ClientDevice.findById(deviceId);
   if(!cliDevice){
       return null;
   }
   return cliDevice;
},
getBranchDetails = async(branchId,clientNumber)=>{
    if(!clientNumber){
        return null;
    }
   const Branch = model.getBranchModel(clientNumber);
   const branc = await Branch.findById(branchId);
   if(!Branch){
       return null;
   }
   return {
       id: branc._id,
       name: Name
   };
}