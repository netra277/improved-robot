
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');
const constants = require('../commons/enums');
const model = require('../dbconnections/connection_initializer');
const config = require('../configuration/config');
const User = model.getUserModel();

module.exports = {
  create: async (req, res, next) => {
    console.log('createUser method entry');
    console.log('requested user: ', req.user);

    console.log('getting role details for role id: ', req.value.body.role);
    let creatingUserRole;
    if (req.user.role.role === rolesList.Admin) {
      creatingUserRole = await Role.findOne({ _id: req.value.body.role, isClientLevel: true });
    }
    if (!creatingUserRole) {
      console.log('invalid role id. exiting');
      return res.status(404).json({
        message: 'invalid role details'
      });
    }
    const User = model.getUserModel();

    const usr = new User({
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


    if (req.user.role.role === rolesList.Admin) {
      usr.clientId = req.user.clientId;
      usr.userId = req.user.clientId.clientId + usr.username;
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
    const dupUser = await User.findOne({ userId: usr.clientId.clientId.toUpperCase() + usr.username.toUpperCase() });
    if (dupUser) {
      return res.status(500).json({
        message: 'user already exist'
      })
    }
    const Branch = model.getBranchModel(req.user.clientId.clientId);
    const branch = await Branch.findById(req.value.body.branchId);
    if (!branch) {
      return res.status(500).json({
        message: 'no branch exist'
      });
    }

    const savedUser = await usr.save();
    console.log('saved user', savedUser);

    if (req.user.role.role === rolesList.Admin) {
      const RegisteredUser = model.getRegisteredUsersModel(req.user.clientId.clientId);
      const registeredUser = new RegisteredUser({
        username: savedUser.username,
        userId: savedUser.userId,
        name: savedUser.name,
        createdDate: new Date().toISOString(),
        phone: savedUser.phone,
        email: savedUser.email,
        lastLogin: '',
        role: creatingUserRole,
        status: savedUser.status
      });

      const savedRegisteredUser = await registeredUser.save();



      console.log('branch exist');
      const BranchUser = model.getBranchUserModel(req.user.clientId.clientId);
      let branchUser = await BranchUser.findOne({ branchId: req.value.body.branchId });
      if (!branchUser) {
        console.log('creating new branchuser');
        branchUser = new BranchUser({
          _id: new mongoose.Types.ObjectId(),
          branchId: req.value.body.branchId,
          userIds: savedRegisteredUser._id
        });
      } else {
        console.log('updating new branchuser');
        if (!branchUser.userIds) {
          branchUser.userIds = [];
        }
        branchUser.userIds.push(savedRegisteredUser._id);
      }
      const savedBranchUser = await branchUser.save();
      if (savedBranchUser) {
        return res.status(200).json({
          message: 'User created successfully'
        })
      } else {
        return res.status(500).json({
          message: 'Error in creating user'
        })
      }
    }
  },
  getUser: async (req, res, next) => {
    const RegisteredUser = model.getRegisteredUsersModel(req.user.clientId.clientId);
    const Role = model.getRoleModel();
    let usr = await RegisteredUser.findById(req.value.params.id).populate('role');
    usr.password = '';
    let branchsUser = await BranchUser.find({ userIds: usr._id });
    console.log('singlebranchUsr:', branchsUser);
    const branch = await Branch.findOne({ _id: branchsUser[0].branchId });
    console.log('branchdetails:', branch);
    usr.branch = {
      branchId: branch.branchId,
      _id: branch._id,
      name: branch.name
    };
    if (req.user.role.role === rolesList.Admin) {
      return res.status(200).json(usr);
    }
    else if (req.user.role.role === rolesList.User && req.user.userId === usr.userId) {
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
    const BranchUser = model.getBranchUserModel(usr.clientId.clientId);
    const Branch = model.getBranchModel(usr.clientId.clientId);
    const RegisteredUsers = model.getRegisteredUsersModel(usr.clientId.clientId);
    let filteredUsers = [];
    if (usr.role.role === rolesList.Admin || usr.role.role === rolesList.Supervisor) {
      console.log('in admin');
      let usrs = await RegisteredUsers.find().lean();

      for (let index = 0; index < usrs.length; index++) {
        const singleUser = usrs[index];
        singleUser.role = await Role.findById(singleUser.role);
        let branchsUser = await BranchUser.find({ userIds: singleUser._id });
        console.log('singlebranchUsr:', branchsUser);
        const branch = await Branch.findOne({ _id: branchsUser[0].branchId });
        console.log('branchdetails:', branch);
        singleUser.branch = {
          branchId: branch.branchId,
          _id: branch._id,
          name: branch.name
        };
        filteredUsers.push(singleUser);
      }
      return res.status(200).json(filteredUsers);
    }
    else {
      return res.status(401).json({
        message: 'unauthorized'
      });
    }
  },
  delete: async (req, res, next) => {
    const User = model.getUserModel();
    const RegisteredUser = model.getRegisteredUsersModel(req.user.clientId.clientId);
    console.log('clientId', req.user.clientId.clientId, 'param:', req.value.params.id);
    const remRegisteredUser = await RegisteredUser.findById(req.value.params.id);
    if (!remRegisteredUser) {
      return res.status(500).json({
        message: 'user not found'
      });
    }
    const remCommonUser = await User.findOne({ userId: remRegisteredUser.userId });
    if (req.user.role.role === rolesList.Admin) {
      const resp = await RegisteredUser.deleteOne({ _id: remRegisteredUser._id });
      const BranchUser = model.getBranchUserModel(req.user.clientId.clientId);
      let branchUser = await BranchUser.findOne({ userIds: req.value.params.id });
      console.log('branchUser:', branchUser);
      var index = branchUser.userIds.indexOf(req.value.params.id);
      console.log('index:', index);
      if (index > -1) {
        branchUser.userIds.splice(index, 1);
      }
      await branchUser.save();
      remCommonUser.isDeleted = true;
      await remCommonUser.save();
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
    const RegisteredUser = model.getRegisteredUsersModel(req.user.clientId.clientId);
    const User = model.getUserModel();
    const updRegisteredUser = await RegisteredUser.findById(req.value.params.id);
    const commonUser = await User.findOne({ userId: updRegisteredUser.userId });
    console.log('updating user: ', updRegisteredUser);
    if (req.value.body.name && req.value.body.name !== '') {
      commonUser.name = updRegisteredUser.name = req.value.body.name;
    }
    if (req.value.body.phone && req.value.body.phone !== '') {
      commonUser.phone = updRegisteredUser.phone = req.value.body.phone;
    }
    if (req.value.body.email && req.value.body.email !== '') {
      commonUser.email = updRegisteredUser.email = req.value.body.email;
    }
    if (req.value.body.role && req.value.body.role !== '') {
      commonUser.role = updRegisteredUser.role = updatingRol;
    }
    if (req.value.body.status !== constants.UserStatus.Active &&
      req.value.body.status !== constants.UserStatus.Inactive) {
      return res.status(404).json({
        message: 'Invalid status'
      });
    }
    commonUser.status = updRegisteredUser.status = req.value.body.status;
    console.log('reqclient:', req.user.clientId._id, 'commonuserclient', commonUser.clientId);
    if (req.user.role.role === rolesList.Admin && req.user.clientId._id.toString() === commonUser.clientId.toString()) {
      const registereduserUpdated = await RegisteredUser.updateOne({ _id: req.value.params.id }, updRegisteredUser);
      const commonuserUpdated = await User.updateOne({ userId: updRegisteredUser.userId }, commonUser);
      if (registereduserUpdated.nModified > 0 && commonuserUpdated.nModified > 0) {
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
  resetPassword: async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash 
    const PasswordHash = await bcrypt.hash(req.value.body.password, salt);
    const User = model.getUserModel();
    const usr = User.updateOne({ _id: req.user._id }, { password: PasswordHash });
    if (usr.nModified > 0) {
      return res.status(200).json({
        message: 'password updated successfully'
      });
    }
    else {
      return res.status(500).json({
        message: 'error updating password'
      });
    }
  }
}