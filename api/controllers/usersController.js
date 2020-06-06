
const mongoose = require('mongoose');
const constants = require('../constants/enums');
const model = require('../dbconnections/connection_initializer');
const config = require('../configuration/config');
const randomString = require('randomstring');
const Role = model.getRoleModel();


module.exports = {
  create: async (req, res, next) => {
    console.log('createUser method entry');
    const usr = req.user;
    const reqData = req.body;
    const role = Role.findById(reqData.role_id);
    if(!role || role.Role !== constants.Roles.USER || 
      role.Role !== constants.Roles.MANAGER || role.Role !== constants.Roles.STORE_SUPERVISOR){
      return res.status(500).json({
        message: {
          detail: 'Invalid role'
        }
      });
    }
    const Branch = model.getBranchModel(usr.ClientNumber);
    const branchids = reqData.branch_id ?  reqData.branch_id : ''; 
    if(branchids !== ''){
      const branch = Branch.findById(reqData.branch_id);
      if(!branch){
        return res.status(500).json({
          message: {
            detail: 'Invalid branch'
          }
        });
      }
    }
    
    const User = model.getUserModel(usr.ClientNumber);
    uIdrandom = randomString.generate({
      length: 6,
      charset: 'alphanumeric',
      capitalization: 'uppercase'
      });
      let stat = constants.UserStatus.Inactive;
      if(reqData.active){
        stat = constants.UserStatus.Active;
      }
    const user = new User({
      Username: reqData.username,
      Password: reqData.password,
      UserId: usr.ClientNumber + uIdrandom,
      Name: reqData.name,
      CreatedDate: Date.now(),
      Phone: reqData.phone,
      Email: reqData.email,
      RoleId: reqData.role_id,
      Status: stat,
      BranchId: branchids
    });

    console.log('checking for duplicate user ');
    const dupUser = await User.findOne({ Username: user.Username });
    if (dupUser) {
      return res.status(500).json({
        message: 'user already exist'
      });
    }
     
    const savedUser = await user.save();
    if(savedUser){
      return res.status(200).json({
        message: {
          detail : 'user created successfully!'
        }
      });
    }
    return res.status(500).json({
      message:{
        detail: 'error creating user'
      }
    })
  },
  getUser: async (req, res, next) => {
    const usr = req.user; 
    console.log('getting user', req.user._id)
    const Branch = model.getBranchModel(usr.ClientNumber);
    const User = model.getUserModel(usr.ClientNumber);
    let users = await User.findById(req.params.id,'-Password')
                            .populate('RoleId','Role RoleName',Role)
                            .populate('BranchId','BranchId Name');
    return res.status(200).json(users);
  },
  getUsers: async (req, res, next) => {
    const usr = req.user; 
    const Branch = model.getBranchModel(usr.ClientNumber);
    const User = model.getUserModel(usr.ClientNumber);
    let users = await User.find({},'-Password')
                            .populate('RoleId','Role RoleName',Role)
                            .populate('BranchId','BranchId Name');
    return res.status(200).json(users);
  },
  delete: async (req, res, next) => {
    const usr = req.user; 
    console.log('getting user', req.user._id)
    const User = model.getUserModel(usr.ClientNumber);
    const user = await User.findById({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({
                message: 'user id doesnot exist'
            });
        } else {
            const resp = await User.remove({ _id: req.params.id });
            if (resp.deletedCount > 0) {
                    return res.status(200).json({
                        message: 'user deleted successfully'
                    });
            }
            return res.status(500).json({
                message: 'error deleting user'
            });
        }
  },
  update: async (req, res, next) => {
    const usr = req.user;
    const reqData = req.body;
    const role = Role.findById(reqData.role_id);
    if(!role || role.Role !== constants.Roles.USER || 
      role.Role !== constants.Roles.MANAGER || role.Role !== constants.Roles.STORE_SUPERVISOR){
      return res.status(500).json({
        message: {
          detail: 'Invalid role'
        }
      });
    }
    const branchids = reqData.branch_id ?  reqData.branch_id : ''; 
    if(branchids !== ''){
      const branch = Branch.findById(reqData.branch_id);
      if(!branch){
        return res.status(500).json({
          message: {
            detail: 'Invalid branch'
          }
        });
      }
    }
    
    const Branch = model.getBranchModel(usr.ClientNumber);
    const branch = Branch.findById(reqData.branch_id);
    if(!branch){
      return res.status(500).json({
        message: {
          detail: 'Invalid branch'
        }
      });
    }
    const User = model.getUserModel(usr.ClientNumber);
    const user = User.findById(req.params.id);
    if (reqData.name && reqData.name !== '') {
      user.Name = req.value.body.name;
    }
    if (reqData.phone && reqData.phone !== '') {
      user.Phone = req.value.body.phone;
    }
    if (reqData.email && reqData.email !== '') {
      user.Email = reqData.email;
    }
    if (reqData.role_id && reqData.role_id !== '') {
      user.RoleId = reqData.role_id;
    }
    if (reqData.status && reqData.status !== '') {
      user.Status = reqData.status;
    }
    if (reqData.branchids && reqData.branchids !== '') {
      user.BranchId = reqData.branchids;
    }
    const userUpdated = await User.updateOne({ _id: user._id }, user);
            if (userUpdated.nModified > 0) {
                return res.status(200).json({
                    message: 'user updated successfully'
                });
            }
            return res.status(500).json({
                message: 'error updating user'
            });
     
  },
  resetPassword: async (req, res, next) => {
    const usr = req.user; 
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash 
    const PasswordHash = await bcrypt.hash(req.body.password, salt);
    const User = model.getUserModel(usr.ClientNumber);
    const upduser = User.updateOne({ _id: req.params.id }, { Password: PasswordHash });
    if (upduser.nModified > 0) {
      return res.status(200).json({
        message: 'password updated successfully'
      });
    }
      return res.status(500).json({
        message: 'error updating password'
      });
  }
}