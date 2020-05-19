const mongoose = require('mongoose');
const rolesList = require('../auth/roles');
const constants = require('../constants/enums');
const model = require('../dbconnections/connection_initializer');
const config = require('../configuration/config');
const randomString = require('randomstring');
const encryptor = require('../utilities/encryptor');
const AdminUser = model.getAdminUserModel();

module.exports = {
    // This endpoint will be available only for Internal purpose to generate Admin Users
    changeAdminPassword: async (req, res, next) => {
        const reqData = req.body;
        console.log(req.body);
        const adminUsr = await AdminUser.findOne({ Username: reqData.username });
        const isValid = await adminUsr.isValidPassword(reqData.old_password)
        console.log(adminUsr, 'isValidPassword: ', isValid);
        if (reqData.new_password === reqData.repeat_password && isValid) {
            console.log('Changing admin password');
            adminUsr.Password = reqData.new_password;
            console.log(adminUsr._id);
            const updatedUser = await AdminUser.updateOne({_id: adminUsr._id},adminUsr);
            res.status(200).json({
                message: 'Admin password updated'
            });
        }
        else {
            return res.status(500).json({
                message: 'Password does not match or invalid old password'
            });
        }
    }
}