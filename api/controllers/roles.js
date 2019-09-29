const connection = require('../dbconnections/db_connection_common');
const roleSchema = require('../models/roles');
const mongooModels = require('../commons/mongoose-models');
const mongoose = require('mongoose');

module.exports= {
    getRoles: async(req, res, next)=>{
        const Role = getRoleModel();
        const roles = await Role.find({});
        res.status(200).json(roles);
    },
    create: async(req,res,next)=>{
        const Role =  getRoleModel();
        const role = new Role({
            _id:  new mongoose.Types.ObjectId(),
            roleId: req.body.roleId,
            role: req.body.role,
            description: req.body.description,
            levelId: req.body.levelId,
            isClientLevel: req.body.isClientLevel
        });
        const rol = await role.save();
        if(rol){
            console.log('Role created: ',rol.role);
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
        const Role =  getRoleModel();
        const resp = await Role.remove({ _id: req.params.id });
        if(resp.deletedCount > 0){
            res.status(200).json({
                message:'deleted successfully'
            });
        } 
    },
    update:(req, res, next)=>{
        const Role =  getRoleModel();
    }
}
function getRoleModel(){
    const con = connection.connectToDatabase();
    return con.model(mongooModels.RolesModel,roleSchema);
}