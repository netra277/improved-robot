const jwt = require('jsonwebtoken');

const UserSchema = require('../models/users');
const config = require('../configuration/config');
const connection = require('../dbconnections/db_connection_common');
const mongoose = require('mongoose');
const ClientSchema = require('../models/clients');
const RoleSchema = require('../models/roles');
const mongooModels = require('../commons/mongoose-models');
const rolesList = require('../auth/roles');

signToken = user =>{
  return token =  jwt.sign({
    user:{
      id: user._id,
      clientId: user.clientId,
      name: user.name
    },
    iss:'d-epos',
    sub: user.id,
    iat: new Date().getDate(),
    exp: new Date().setDate(new Date().getDate() + 1)
  },config.jwtSecretKey);
}

module.exports = {
    login: async(req,res,next)=>{
      console.log(req);
      const token = signToken(req.user);
      res.status(200).json({token});
    },
    createUser: async(req,res,next)=>{
      console.log('createUser method entry');
      const con = connection.connectToDatabase();
        const Client = con.model(mongooModels.ClientsModel,ClientSchema);
        console.log('getting client details for clientId: ',req.user.clientId);
        
          const cli = await Client.findById(req.user.clientId);
          if(!cli){
            console.log('invalid client id, Exiting...');
            res.status(404).json({
              message:'invalid client details'
            });
          }
        const Role = con.model(mongooModels.RolesModel,RoleSchema);
        console.log('getting role details for role id: ',req.user.role);
          const role = await Role.findById(req.user.role);
          if(!role){
            console.log('invalid role id. exiting');
            res.status(404).json({
              message:'invalid role details'
            });
          }
          if(role.role === rolesList.SuperUser){

          }
        const User = getUserModel();
        const usr= new User({
          _id: new mongoose.Types.ObjectId(),
          username: req.value.body.username,
          password: req.value.body.password,
          userId: 'CLI123NET123',
          clientId : req.value.body.clientId,
          name: req.value.body.name,
          createdDate: new Date().toISOString(),
          phone: req.value.body.phone,
          email: req.value.body.email,
          lastLogin: new Date().toISOString(),
          role: req.value.body.role,
          status: req.value.body.status
        });
    //  await usr.save()
    //   .then(result=>{
    //     console.log('user created');
    //     res.status(201).json({
    //       message: 'User created successfully'
    //     });
    //   })
    //   .catch(err =>{
    //     console.log('error in creating user: ',err);
    //     res.status(500).json({
    //       message: 'Error creating user' 
    //     });
    //   });
    },
    getUser:async(req,res,next)=>{
      const User = getUserModel();
      console.log('getuser:',req.user);
      // const usr = await User.findOne({username});
    }

}
function getUserModel(){
  const con = connection.connectToDatabase();
  return con.model(mongooModels.UsersModel,UserSchema);
}