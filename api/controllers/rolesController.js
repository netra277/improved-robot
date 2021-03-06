const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const constants = require('../constants/enums');
const config = require('../configuration/config');
const Role = model.getRoleModel();

module.exports = {
    getRoles: async (req, res, next) => {
        const roles = await Role.find();
        return res.status(200).json(roles);
    },
    getRole: async (req, res, next) => {
        console.log(req.params.id);
        const role = await Role.findOne({_id: req.params.id});
        return res.status(200).json(role);
    },
    create: async (req, res, next) => {
        if(req.headers.username !== config.setupUser || req.headers.password !== config.setupPwd){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        console.log('request'+  req.headers.role);
        const reqBodyData = req.body;
        const Role = model.getRoleModel();
        const countR = await Role.find().countDocuments();
        if(!constants.Roles.hasOwnProperty(reqBodyData.role)){
            return res.status(500).json({
                message: 'invalid role'
            });
        }
        const role = new Role({
            _id: new mongoose.Types.ObjectId(),
            RoleId: countR + 1,
            Role: reqBodyData.role,
            RoleName: reqBodyData.role_name,
            Description: reqBodyData.description,
            IsClientLevel: reqBodyData.is_client_level
        });
        console.log('beforecalling save', role);

        const roli = await role.save();
        if (roli) {
            console.log('Role created: ', roli.Role);
            return res.status(200).json({
                message: 'role created successfully'
            });
        }
        console.log('role not created');
        return res.status(500).json({
            message: 'role not created'
        });
    },
    update: async (req, res, next) => {
        if(req.headers.username !== config.setupUser || req.headers.password !== config.setupPwd){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const reqBodyData = req.body;
        const r = await Role.updateOne({ _id: req.params.id }, {
            RoleName : reqBodyData.role_name,
            Description: reqBodyData.description
        });
        if (r.nModified > 0) {
            return res.status(200).json({
                message: 'role updated successfully'
            });
        } else {
            res.status(500).json({
                message: 'error in updating role'
            });
        }
    }
}