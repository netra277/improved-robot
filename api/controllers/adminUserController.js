const mongoose = require('mongoose');
const constants = require('../constants/enums');
const model = require('../dbconnections/connection_initializer');
const config = require('../configuration/config');
const randomString = require('randomstring');
const encryptor = require('../utilities/encryptor');
const AdminUser = model.getAdminUserModel();
const Client = model.getClientModel();
const Role = model.getRoleModel();


module.exports = {
    // This endpoint will be available only for Internal purpose to generate Admin Users
    createAdminUser: async (req, res, next) => {
        if(req.headers.username !== config.setupUser || req.headers.password !== config.setupPwd){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const reqBody = req.body;
        userId = randomString.generate({
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        });
        let clientId = '';
        do {
            clientId = randomString.generate({
                length: 6,
                charset: 'alphanumeric',
                capitalization: 'uppercase'
            });
        } while (await Client.find({ClientId: clientId}).countDocuments()> 0)
        let clientKey = encryptor.encrypt(clientId);
        // insert client details 
        const clientdetails = new Client({
            ClientId: clientId,
            Name: reqBody.company_name,
            ClientKey: clientKey,
            Address: reqBody.address,
            Phone: reqBody.phone,
            Status: constants.ClientStatus.Subscribed,
            Email: reqBody.email, 
            SubscriptionEndDate: new Date(reqBody.subscribed_till_date),
        });
        try{
        const savedclient = await clientdetails.save();
        console.log('savedclient',savedclient);
        const roleDetails = await Role.findOne({Role: constants.Roles.ADMIN });
        console.log('role',roleDetails);
        let password = randomString.generate(10);
            const adminUsr = new AdminUser( {
              UserId : clientId + userId,
              Name: reqBody.name,
              Username : clientId.substring(0,3) + reqBody.name.split(" ").join("").substring(0,4) + reqBody.phone.toString().substring(6,10),
              Password : password,
              Address : reqBody.address,
              Email : reqBody.email,
              Phone : reqBody.phone,
              Status : constants.AdminUserStatus.Created,
              ClientId : savedclient._id
           });
           const savingUser = {
               Username: adminUsr.Username,
               Password: password,
               Key: clientKey
           };
           
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