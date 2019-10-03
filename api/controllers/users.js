
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');
const constants = require('../commons/enums');
const model = require('../dbconnections/connection_initializer');

module.exports = {
  
  create: async (req, res, next) => {
    console.log('createUser method entry');
    const Client = model.getClientModel();
    console.log('getting client details for clientId: ', req.user.clientId);

    const requestedUserCli = await Client.findById(req.user.clientId);
    if (!requestedUserCli) {
      console.log('invalid client id, Exiting...');
      res.status(404).json({
        message: 'invalid client details'
      });
    }
    const Role = model.getRoleModel();
    console.log('getting role details for role id: ', req.value.body.role);
    const creatingUserRole = await Role.findById(req.value.body.role);
    if (!creatingUserRole) {
      console.log('invalid role id. exiting');
      res.status(404).json({
        message: 'invalid role details'
      });
    }
    const User = model.getUserModel();
    const dupUser = await User.findOne({username : req.value.body.username,userId: reqUserCli.cliendId + req.value.body.username });
    if(dupUser){
      res.status(500).json({
        message:'user already exist'
      })
    }
    const clientId = req.value.body.clientId;
    const usr = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.value.body.username,
      password: req.value.body.password,
      userId: '',
      clientId: '',
      name: req.value.body.name,
      createdDate: new Date().toISOString(),
      phone: req.value.body.phone,
      email: req.value.body.email,
      lastLogin: new Date().toISOString(),
      role: reqUserRole,
      status: req.value.body.status
    });

    if (reqUserRole.role === rolesList.SuperUser) {
      if (!clientId && clientId === '') {
        res.status(404).json({
          message: 'client id is required'
        });
      }
      const newClient = await Client.findById(clientId);
      usr.clientId = newClient;
      usr.userId = usr.clientId + usr.username;
    }
    else if (reqUserRole.role === rolesList.Admin) {
      usr.clientId = reqUserCli;
      usr.userId = clientId + usr.username;
      const selRole = req.value.body.role;
      if (!selRole || selRole === '') {
        res.status(404).json({
          message: 'role is required'
        });
      }
      if (dbRoles.length > 0) {
        const r = dbRoles.filter((f) => {
          return f._id === selRole;
        });
        if (r.length > 0) {
          usr.role = r[0]._id;
        } else {
          res.status(404).json({
            message: 'invalid role id'
          });
        }
      }

    }
    else {
      res.status(401).json({
        message: 'unauthorized'
      });
    }
    if (usr.status !== constants.UserStatus.Active ||
      usr.status !== constants.UserStatus.Inactive) {
      res.status(404).json({
        message: 'Invalid status'
      });
    }

    usr.save()
      .then(result => {
        console.log('user created');
        res.status(201).json({
          message: 'User created successfully'
        });
      })
      .catch(err => {
        console.log('error in creating user: ', err);
        res.status(500).json({
          message: 'Error creating user'
        });
      });
  },
  getUser: async (req, res, next) => {
    console.log('value: ',req.value);
    const reqUsr = req.user;

    const Client = model.getClientModel();
    console.log('getting client details for clientId: ', req.user.clientId);
    const reqUserCli = await Client.findById(reqUsr.clientId);
    if (!reqUserCli) {
      console.log('invalid client id, Exiting...');
      res.status(404).json({
        message: 'unauthorized'
      });
    }
    let canAccess = false;
    if (reqUsr.role.role === rolesList.SuperUser ||
      reqUsr.role.role === rolesList.PowerUser) {
      canAccess = true;
    }
    const User = model.getUserModel();
    let usr = await User.findById(req.value.params.id);
    usr.password = '';
    if (canAccess) {
      res.status(200).json(usr);
    }
    else if (reqUserRole.role === rolesList.Admin && reqUserCli._id === usr.clientId) {
      res.status(200).json(usr);
    }
    else if (reqUserRole.role === rolesList.User && reqUserCli._id === usr.clientId
      && req.user.username === usr.username && req.user._id === usr._id && req.user.userId === usr.userId) {
      res.status(200).json(usr);
    }
    else {
      res.status(401).json({
        message: 'unauthorized'
      });
    }
  },
  getUsers: async (req, res, next) => {
    const usr = req.user;
    const User = model.getUserModel();
    if(usr.role.role === rolesList.SuperUser || usr.role.role === rolesList.PowerUser){
      const usrs = await User.find({});
      usrs.forEach(function(element) {
        element.password = '';
      });
      res.status(200).json(usrs);
    }
    else if (usr.role.role === rolesList.Admin || usr.role.role === rolesList.Supervisor) {
      const usrs = await User.find({ clientId: usr.clientId });
      usrs.forEach(function(element) {
        element.password = '';
      });
      res.status(200).json(usrs);
    }
    else if (usr.role.role === rolesList.Manager) {
      // implement when branches are done
      res.status(200).json({
        message: 'yet to implement'
      });
    }
    else if (usr.role.role === rolesList.User) {
      const User = model.getUserModel();
      const usr = await User.find({ _id: req.user._id });
      usr.forEach(function(element) {
        element.password = '';
      });
      res.status(200).json(usr);
    }
    else {
      res.status(401).json({
        message: 'unauthorized'
      });
    }
  },
  delete: async (req, res, next) => {
    const Role = model.getRoleModel();
    const rol = Role.findById(req.user.role);
    const User = model.getUserModel();
    const remUser = await User.findById(req.params.id);
    if (rol.role === rolesList.SuperUser || (remUser.clientId === req.user.clientId && rol.role === rolesList.Admin)) {
      const resp = await User.remove(req.params.id);
      if (resp.deletedCount > 0) {
        res.status(200).json({
          message: 'deleted successfully'
        });
      }
      res.status(500).json({
        message:'could not able to delete'
      });
    }
    res.status(401).json({
      message: 'unauthorized'
    });
  },
  update: async (req, res, next) => {
    const Role = model.getRoleModel();
    const rol = Role.findById(req.user.role);
    const updatingRol = Role.findById(req.value.body.role);
    const User = model.getUserModel();
    const updUser = await User.findById(req.params.id);
    let canUpdate = false;
    if(rol.role === rolesList.SuperUser){
      canUpdate = true;
    }
    if(req.value.body.name && req.value.body.name !== ''){
      updUser.name = req.value.body.name;
    }
    if(req.value.body.phone && req.value.body.phone !== ''){
      updUser.phone = req.value.body.phone;
    }
    if(req.value.body.email && req.value.body.email !== ''){
      updUser.email = req.value.body.email;
    }
    if(req.value.body.role && req.value.body.role !== ''){
      updUser.name = req.value.body.name;
    }
    if(rol.role === rolesList.Admin && req.user.clientId === updUser.clientId){
     const userUpdated = await updUser.save();
     if(userUpdated){
       res.status(200).json({
         message:'user updated successfully'
       });
     }
     res.status(500).json({
       message: 'error updating user'
     });
    }
    else {
      res.status(401).json({
        message:'unauthorized'
      });
    }
  }

}