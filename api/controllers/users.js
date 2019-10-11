
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');
const constants = require('../commons/enums');
const model = require('../dbconnections/connection_initializer');

module.exports = {

  create: async (req, res, next) => {
    console.log('createUser method entry');
    const Client = model.getClientModel();
    console.log('getting client details for clientId: ', req.user.clientId._id);

    const requestedUserCli = await Client.findById(req.user.clientId._id);
    if (!requestedUserCli) {
      console.log('invalid client id, Exiting...');
      return res.status(404).json({
        message: 'invalid client details'
      });
    }
    const Role = model.getRoleModel();
    console.log('getting role details for role id: ', req.value.body.role);
    const creatingUserRole = await Role.findById(req.value.body.role);
    if (!creatingUserRole) {
      console.log('invalid role id. exiting');
      return res.status(404).json({
        message: 'invalid role details'
      });
    }
    const User = model.getUserModel();

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
      lastLogin: '',
      role: creatingUserRole,
      status: req.value.body.status
    });

    if (req.user.role.role === rolesList.SuperUser) {
      if (!req.value.body.clientId || req.value.body.clientId === '') {
        res.status(404).json({
          message: 'client id is required'
        });
      }
      const newClient = await Client.findById(req.value.body.clientId);
      
      usr.clientId = newClient;
      usr.userId = newClient.clientId + usr.username;
    }
    else if (req.user.role.role === rolesList.Admin) {
      usr.clientId = requestedUserCli;
      usr.userId = requestedUserCli.clientId + usr.username;
    }
    else {
      return res.status(401).json({
        message: 'unauthorized'
      });
    }
    if (usr.status !== constants.UserStatus.Active &&
      usr.status !== constants.UserStatus.Inactive) {
      return res.status(404).json({
        message: 'Invalid status'
      });
    }
    console.log('checking for duplicate user ');
    const dupUser = await User.findOne({ username: usr.username.toUpperCase(), userId: usr.clientId.clientId.toUpperCase() + usr.username.toUpperCase() });
    if (dupUser) {
      res.status(500).json({
        message: 'user already exist'
      })
    }
    await usr.save()
      .then(result => {
        console.log('user created');
        if(req.user.role.role === rolesList.Admin){
          const BranchUser = model.getBranchUserModel(requestedUserCli.clientId);
          const branch = new BranchUser({
            _id: new mongoose.Types.ObjectId(),
            branchId: req.value.body.branchId,
            userId: result._id
          });
           branch.save()
            .then(result =>{
              console.log('user assigned to branch ');
              return res.status(201).json({
                message: 'User created successfully'
              });
            }).catch(err =>{
              console.log('error in assigning branch to user');
              return res.status(500).json({
                message: 'error in creating user'
              })
            });
        }
        return res.status(201).json({
          message: 'user created successfully'
        });
        
      })
      .catch(err => {
        console.log('error in creating user: ', err);
        return res.status(500).json({
          message: 'Error creating user'
        });
      });
  },
  getUser: async (req, res, next) => {
    console.log('value: ', req.value);
    const reqUsr = req.user;

    const Client = model.getClientModel();
    console.log('getting client details for clientId: ', reqUsr.clientId);
    const reqUserCli = await Client.findById(reqUsr.clientId);
    if (!reqUserCli) {
      console.log('invalid client id, Exiting...');
      return res.status(404).json({
        message: 'unauthorized'
      });
    }
    const User = model.getUserModel();
    let usr = await User.findById(req.value.params.id);
    usr.branchId = getBranchDetails(usr._id);
    usr.role = getRoleDetails(usr.role);
    usr.password = '';
    if (reqUsr.role.role === rolesList.SuperUser ||
      reqUsr.role.role === rolesList.PowerUser) {

      return res.status(200).json(usr);
    }
    else if (reqUserRole.role === rolesList.Admin && reqUserCli._id === usr.clientId) {
      return res.status(200).json(usr);
    }
    else if (reqUserRole.role === rolesList.User && reqUserCli._id === usr.clientId
      && req.user.username === usr.username && req.user._id === usr._id && req.user.userId === usr.userId) {
      return res.status(200).json(usr);
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
    if (usr.role.role === rolesList.SuperUser || usr.role.role === rolesList.PowerUser) {
      const usrs = await User.find({});
      usrs.forEach(function (element) {
        element.branchId = getBranchDetails(element._id);
        element.role = getRoleDetails(element.role);
        element.password = '';
      });
      return res.status(200).json(usrs);
    }
    else if (usr.role.role === rolesList.Admin || usr.role.role === rolesList.Supervisor) {
      const usrs = await User.find({ clientId: usr.clientId._id });
      usrs.forEach(function (element) {
        element.branchId = getBranchDetails(element._id);
        element.role = getRoleDetails(element.role);
        element.password = '';
      });
      return res.status(200).json(usrs);
    }
    else if (usr.role.role === rolesList.Manager) {
      // implement when branches are done
      const reqUserBranch = getBranchDetails(usr._id);
      const usrs = await User.find({ clientId: usr.clientId._id });
      const filteredUser = usrs.filter(function (element) {
        const b = getBranchDetails(element._id);
        if (b.branchId === reqUserBranch.branchId) {
          element.branchId = b.branchId;
        }
        element.password = '';
        element.role = getRoleDetails(element.role);
        return element;
      });
      return res.status(200).json(filteredUser);
    }
    else if (usr.role.role === rolesList.User) {
      const User = model.getUserModel();
      const usr = await User.find({ _id: req.user._id });
      usr.forEach(function (element) {
        element.branchId = getBranchDetails(element._id);
        element.role = getRoleDetails(element.role);
        element.password = '';
      });
      return res.status(200).json(usr);
    }
    else {
      return res.status(401).json({
        message: 'unauthorized'
      });
    }
  },
  delete: async (req, res, next) => {
    const User = model.getUserModel();
    const remUser = await User.findById(req.value.params.id);
    if (req.user.role.role === rolesList.SuperUser || (remUser.clientId === req.user.clientId && req.user.role.role === rolesList.Admin)) {
      const resp = await User.remove(req.value.params.id);
      const BranchUser = model.getBranchUserModel();
      const res = await BranchUser.remove({userId: req.value.params.id});
      if (resp.deletedCount > 0) {
        return res.status(200).json({
          message: 'deleted successfully'
        });
      }
      return res.status(500).json({
        message: 'could not able to delete'
      });
    } else {
      return res.status(401).json({
        message: 'unauthorized'
      });
    }
  },
  update: async (req, res, next) => {
    const Role = model.getRoleModel();
    const updatingRol = await Role.findById(req.value.body.role);
    const User = model.getUserModel();
    const updUser = await User.findById(req.value.params.id);
    if (req.value.body.name && req.value.body.name !== '') {
      updUser.name = req.value.body.name;
    }
    if (req.value.body.phone && req.value.body.phone !== '') {
      updUser.phone = req.value.body.phone;
    }
    if (req.value.body.email && req.value.body.email !== '') {
      updUser.email = req.value.body.email;
    }
    if (req.value.body.role && req.value.body.role !== '') {
      updUser.role = updatingRol;
    }
    if (req.value.body.branchId && req.value.body.branchId !== '') {
      const Branch = model.getBranchUserModel();
      const branch = await Branch.updateOne({ userId: req.value.params.id }, { branchId: req.value.body.branchId });
      if (userUpdated.nModified > 0) {
        return res.status(200).json({
          message: 'user updated with branch details successfully'
        });
      } else {
        return res.status(500).json({
          message: 'error updating branch to user'
        });
      }
    }
    if (req.value.body.status !== constants.UserStatus.Active &&
      req.value.body.status !== constants.UserStatus.Inactive) {
      return res.status(404).json({
        message: 'Invalid status'
      });
    }
    updUser.status = req.value.body.status;
    if (req.user.role.role === rolesList.SuperUser || (req.user.role.role === rolesList.Admin && req.user.clientId === updUser.clientId)) {
      const userUpdated = await User.updateOne({ _id: req.value.params.id }, updUser);
      if (userUpdated.nModified > 0) {
        return res.status(200).json({
          message: 'user updated successfully'
        });
      } else {
        return res.status(500).json({
          message: 'error updating user'
        });
      }
    }
    else {
      return res.status(401).json({
        message: 'unauthorized'
      });
    }
  },
  resetPassword: async(req,res,next)=>{
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash 
    const PasswordHash = await bcrypt.hash(req.value.body.password,salt);
    const User = model.getUserModel();
    const usr = User.updateOne({_id: req.user._id},{password: PasswordHash});
    if(usr.nModified > 0){
      return res.status(200).json({
        message:'password updated successfully'
      });
    }
    else {
      return res.status(500).json({
        message:'error updating password'
      });
    }
  }
}

async function getBranchDetails(userId) {
  const BranchUser = model.getBranchUserModel();
  const Branch = model.getBranchModel();
  const branchUserDetails = await BranchUser.findOne({ userId });
  if (branchUserDetails) {
    const branch = await Branch.findOne({ branchId });
    return branch;
  }
  return null;
}
async function getRoleDetails(roleId) {
  const Role = model.getRoleModel();
  return await Role.findOne({ _id: roleId });

}