const jwt = require('jsonwebtoken');

const config = require('../configuration/config');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');
const constants = require('../commons/enums');
const model = require('../dbconnections/connection_initializer');

signToken = user => {
  return token = jwt.sign({
    user: {
      id: user._id,
      clientId: user.clientId,
      name: user.name
    },
    iss: 'd-epos',
    sub: user.id,
    iat: new Date().getDate(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, config.jwtSecretKey);
}

module.exports = {
  login: async (req, res, next) => {
    console.log(req);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  create: async (req, res, next) => {
    console.log('createUser method entry');
    const Client = model.getClientModel();
    console.log('getting client details for clientId: ', req.user.clientId);

    const reqUserCli = await Client.findById(req.user.clientId);
    if (!reqUserCli) {
      console.log('invalid client id, Exiting...');
      res.status(404).json({
        message: 'invalid client details'
      });
    }
    const Role = model.getRoleModel();
    console.log('getting role details for role id: ', req.user.role);
    const reqUserRole = await Role.findById(req.user.role);
    if (!reqUserRole) {
      console.log('invalid role id. exiting');
      res.status(404).json({
        message: 'invalid role details'
      });
    }
    const dbRoles = await Role.find({ isClientLevel: true });
    const User = getUserModel();
    const dupUser = await User.findOne({userId: reqUserCli.cliendId + req.value.body.username });
    if(dupUser){
      res.status(500).json({
        message:'user already exist'
      })
    }
    const usr = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.value.body.username,
      password: req.value.body.password,
      userId: '',
      clientId: req.value.body.clientId,
      name: req.value.body.name,
      createdDate: new Date().toISOString(),
      phone: req.value.body.phone,
      email: req.value.body.email,
      lastLogin: new Date().toISOString(),
      role: req.value.body.role,
      status: req.value.body.status
    });

    if (reqUserRole.role === rolesList.SuperUser) {
      if (!usr.clientId && usr.clientId === '') {
        res.status(404).json({
          message: 'client id is required'
        });
      }
      usr.userId = usr.clientId + usr.username
    }
    else if (reqUserRole.role === rolesList.Admin) {
      usr.clientId = reqUserCli._id;
      usr.userId = reqUserCli.clientId + usr.username;
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
    const Role = model.getRoleModel();
    console.log('getting role details for role id: ', req.user.role);
    const reqUserRole = await Role.findById(req.user.role);
    if (!reqUserRole) {
      console.log('invalid role id. exiting');
      res.status(404).json({
        message: 'unauthorized'
      });
    }

    const Client = model.getClientModel();
    console.log('getting client details for clientId: ', req.user.clientId);

    const reqUserCli = await Client.findById(req.user.clientId);
    if (!reqUserCli) {
      console.log('invalid client id, Exiting...');
      res.status(404).json({
        message: 'unauthorized'
      });
    }
    const canAccess = false;
    if (reqUserRole.role === rolesList.SuperUser ||
      reqUserRole.role === rolesList.PowerUser) {
      canAccess = true;
    }
    const User = model.getUserModel();
    const usr = await User.findById(req.params.id);
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
    const Role = model.getRoleModel();
    const rol = Role.findById(req.user.role);
    if (rol.role === rolesList.SuperUser ||
      rol.role === rolesList.PowerUser) {
      const usrs = User.find({});
      res.status(200).json(usrs);
    }
    else if (rol.role === rolesList.Admin || role.role === rolesList.Supervisor) {
      const usrs = User.find({ clientId: req.user.clientId });
      res.status(200).json(usrs);
    }
    else if (rol.role === rolesList.Manager) {
      // implement when branches are done
      res.status(200).json({
        message: 'yet to implement'
      });
    }
    else if (rol.role === rolesList.User) {
      const User = model.getUserModel();
      const usr = await User.find({ _id: req.user._id });
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
    const User = model.getUserModel();
    const updUser = await User.findById(req.params.id);
    if(rol.role === rolesList.SuperUser){

    }
    if(req.value.body.name && req.value.body.name !== ''){
      updUser.name = req.value.body.name;
    }
    if(req.value.body.phone && req.value.body.phone !== ''){
      updUser.name = req.value.body.name;
    }
    if(req.value.body.email && req.value.body.email !== ''){
      updUser.name = req.value.body.name;
    }
    if(req.value.body.role && req.value.body.role !== ''){
      updUser.name = req.value.body.name;
    }
  }

}