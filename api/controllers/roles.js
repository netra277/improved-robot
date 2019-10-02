const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');

module.exports = {
    getRoles: async (req, res, next) => {
        console.log('In getRoles', req.user);
        const usr = req.user;
        const Role = model.getRoleModel();
        if (usr.role.role === rolesList.SuperUser ||
            usr.role.role === rolesList.PowerUser) {
            const roles = await Role.find({});
            return res.status(200).json(roles);
        }
        res.status(401).json({
            message: 'unauthorized'
        });

    },
    getRole: async (req, res, next) => {
        const Role = model.getRoleModel();
        console.log(req.value);
        if (req.user.role.role === rolesList.SuperUser ||
            req.user.role.role === rolesList.PowerUser) {
            const roles = await Role.findById(req.value.params.id);
            return res.status(200).json(roles);
        }
        res.status(401).json({
            message: 'unauthorized'
        });
    },
    create: async (req, res, next) => {
        const Role = model.getRoleModel();
        const countR = await Role.find().count();
        const role = new Role({
            _id: new mongoose.Types.ObjectId(),
            roleId: countR + 1,
            role: req.value.body.role,
            description: req.value.body.description,
            isClientLevel: req.value.body.isClientLevel
        });
        console.log('beforecalling save', role);

        const roli = await role.save();
        if (roli) {
            console.log('Role created: ', roli.role);
            res.status(200).json({
                message: 'role created successfully'
            });
        }
        console.log('role not created');
        res.status(500).json({
            message: 'role not created'
        });
    },
    delete: async (req, res, next) => {
        const Role = model.getRoleModel();
        if (req.user.role.role !== rolesList.SuperUser) {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const resp = await Role.remove({ _id: req.params.id });
        if (resp.deletedCount > 0) {
            res.status(200).json({
                message: 'deleted successfully'
            });
        }
        else{
            res.status(500).json({
                message:'error in deleting role'
            });
        }
    },
    update: async (req, res, next) => {
        const Role = model.getRoleModel();
        if (req.user.role.role !== rolesList.SuperUser) {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const r = await Role.updateOne({ _id: req.value.params.id }, {
            description: req.value.body.description
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