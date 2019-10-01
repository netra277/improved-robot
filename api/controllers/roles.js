const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');

module.exports= {
    getRoles: async(req, res, next)=>{
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if(rol.role !== rolesList.SuperUser || 
            rol.role !== rolesList.PowerUser){
            res.status(401).json({
                message:'unauthorized'
            });
        }
        const roles = await Role.find({});
        res.status(200).json(roles);
    },
    getRole:async(req,res,next)=>{
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if(rol.role !== rolesList.SuperUser || 
            rol.role !== rolesList.PowerUser){
            res.status(401).json({
                message:'unauthorized'
            });
        }
        const roles = await Role.findById(req.params.id);
        res.status(200).json(roles);
    },
    create: async(req,res,next)=>{
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if(rol.role !== rolesList.SuperUser){
            res.status(401).json({
                message:'unauthorized'
            });
        }
        const ro = Role.findOne({ role: req.value.body.role})
        const role = new Role({
            _id:  new mongoose.Types.ObjectId(),
            roleId: req.value.body.roleId,
            role: req.value.body.role,
            description: req.value.body.description,
            levelId: req.value.body.levelId,
            isClientLevel: req.value.body.isClientLevel
        });
        const roli = await role.save();
        if(roli){
            console.log('Role created: ',roli.role);
            res.status(200).json({
                message: 'role created successfully'
            });
        }
        console.log('role not created');
        res.status(500).json({
            message:'role not created'
        });
    },
    delete:async(req,res,next)=>{
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if(rol.role !== rolesList.SuperUser){
            res.status(401).json({
                message:'unauthorized'
            });
        }
        const resp = await Role.remove({ _id: req.params.id });
        if(resp.deletedCount > 0){
            res.status(200).json({
                message:'deleted successfully'
            });
        } 
    },
    update:async (req, res, next)=>{
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if(rol.role !== rolesList.SuperUser){
            res.status(401).json({
                message:'unauthorized'
            });
        }
        const r = await Role.updateOne({ _id: req.params.id },{
            description: req.value.body.description
        });
        if(r){
            res.status(200).json({
                message:'role updated successfully'
            });
        }
        res.status(500).json({
            message:'error in updating role'
        });
    }
}