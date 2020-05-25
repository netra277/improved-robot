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
        const reqData = req.body;
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
            Name: reqData.company_name,
            ClientKey: clientKey,
            Address: reqData.address,
            Phone: reqData.phone,
            Status: constants.ClientStatus.Subscribed,
            Email: reqData.email,
            UnSubscribedDate: '',
            DevicesRegistered: reqData.number_of_devices,
            SubscribedTillDate: new Date(reqData.subscribed_till_date)
        });
        try{
        const savedclient = await clientdetails.save();
        console.log('savedclint',savedclient);
        const roleDetails = await Role.findOne({Role: constants.Roles.ADMIN });
        console.log('role',roleDetails);
        let password = randomString.generate(10);
            const adminUsr = new AdminUser( {
              UserId : clientId,
              Name: reqData.name,
              Username : reqData.name.split(" ").join("").substring(0,4) + reqData.birth_year + reqData.phone.toString().substring(6,10),
              Password : password,
              BirthYear : reqData.birth_year,
              Address : reqData.address,
              Email : reqData.email,
              Phone : reqData.phone,
              Status : constants.AdminUserStatus.Created,
              ClientId : savedclient._id,
              RequiredPasswordChange: true,
              RoleId: roleDetails._id
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
    },
    activateClient : async(req,res,next)=>{
       const reqData = req.body;
       const adminUs = await AdminUser.findOne({Username: reqData.username});
       adminUs.Status = constants.AdminUserStatus.Active;
       await adminUs.update(adminUs);
       let clientdeta = await Client.findById(adminUs.ClientId);
        clientdeta.IsActive = true;
        clientdeta.Status = constants.ClientStatus.Active;
        await clientdeta.update(clientdeta);
        const User = model.getUserModel(clientdeta.ClientId);
        const usr = new User({
            Username : adminUs.Username,
            Password: 'password',
            UserId: adminUs.UserId,
            Name : adminUs.Name,
            CreatedDate: Date.now(),
            Phone: adminUs.Phone,
            Email: adminUs.Email,
            RoleId: adminUs.RoleId,
            Status: 'active'
        });
        console.log('useract',usr);
       const u =  await usr.save();
       return res.status(200).json({
           message: 'client activated successfully!!!!'
       });
    }
}