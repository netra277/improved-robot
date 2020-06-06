const mongoose = require('mongoose');
const constants = require('../constants/enums');
const model = require('../dbconnections/connection_initializer');
const AdminUser = model.getAdminUserModel();
const Client = model.getClientModel();

module.exports = {
    // This endpoint will be available only for Internal purpose to generate Admin Users
    changeAdminPassword: async (req, res, next) => {
        const reqData = req.body;
        console.log(req.body);
        const adminUsr = await AdminUser.findOne({ Username: reqData.username });
        const clientde = await Client.findById(adminUsr.ClientId);
        if(adminUsr.Status!== constants.AdminUserStatus.Active || !clientde.IsActive){
            return res.status(401).json({
                message: {
                    detail:'Admin user is not activated. Please contact support.'
                }
            });
        }
        const isValid = await adminUsr.isValidPassword(reqData.old_password)
        console.log(adminUsr, 'isValidPassword: ', isValid);
        if (reqData.new_password === reqData.repeat_password && isValid) {
            console.log('Changing admin password');
            adminUsr.Password = reqData.new_password;
            adminUsr.RequiredPasswordChange = false;
            console.log(adminUsr._id);
            const updatedUser = await AdminUser.updateOne({_id: adminUsr._id},adminUsr);
            res.status(200).json({
                message:{
                    detail: 'Admin password updated'
                } 
            });
        }
        else {
            return res.status(500).json({
                message: 'Password does not match or invalid old password'
            });
        }
    }
}