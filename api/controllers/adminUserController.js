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
    createAdminUser: async(req,res,next)=>{
        const reqData = req.body;
        let password = randomString.generate(10);
        let clientId = randomString.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        });
        
        console.log('clientid:',clientId);
        let clientKey = encryptor.encrypt(clientId);
        const adminUsr = new AdminUser( {
          Name: reqData.name,
          Username : reqData.name.split(" ").join("").substring(0,4) + reqData.birth_year + reqData.phone.toString().substring(6,10),
          Password : password,
          BirthYear : reqData.birth_year,
          Address : reqData.address,
          Email : reqData.email,
          NumberOfDevices : reqData.number_of_devices,
          Phone : reqData.phone,
          Status : constants.AdminUserStatus.Created,
          ClientKey : clientKey,
          ClientId : clientId,
          RequiredPasswordChange: true
       });
       const savingUser = {
           Username: adminUsr.Username,
           Password: password,
           Key: clientKey
       };
       try{
        const savedUser = await adminUsr.save();
        return res.status(200).json(savingUser);

       }catch(e){
           console.log('exception',e);
            return res.status(500).json({
                message: 'Error occurred'
            });
       }

    }
}