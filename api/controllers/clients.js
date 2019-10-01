const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');

module.exports = {
    getClients: async (req, res, next) => {
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if (rol.role === rolesList.SuperUser ||
            rol.role === rolesList.PowerUser) {
            const c = model.getClientModel();
            const clients = await c.find({});
            res.status(200).json(clients);
        }
        res.status(401).json({
            message: 'unauthorized'
        });
    },
    getClient: async (req, res, next) => {
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if (rol.role === rolesList.SuperUser ||
            rol.role === rolesList.PowerUser) {
            const c = model.getClientModel();
            const client = await c.find({ _id: req.params.id });
            res.status(200).json(client);
        }
        res.status(401).json({
            message: 'unauthorized'
        });
    },
    create: async (req, res, next) => {
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if(rol.role !== rolesList.SuperUser){
            res.status(401).json({
                message:'unauthorized'
            });
        }
        const Client = model.getClientModel();
        const existClient = Client.find({clientId: req.value.body.clientId });
        if(existClient){
            console.log('client already exist');
            res.status(500).json({
                message:'client already exist'
            });
        }
        const cli = new Client({
            _id: new mongoose.Types.ObjectId(),
            clientId: req.value.body.clientId,
            name: req.value.body.name,
            description: req.value.body.description,
            phone: req.value.body.phone,
            email: req.value.body.email,
            address: req.value.body.address,
            status: req.value.body.status,
            registeredDate: new Date().toISOString(),
            unregisteredDate: ''
        });
        console.log('saving client');
        const c = await cli.save();
        if (c) {
            console.log('client created successfully, Id: ', c.id);
            res.status(200).json({
                message: 'client created successfully'
            });
        }
        console.log('No client created');
        res.status(500).json({
            message: 'client doesnot created'
        });
    },
    update: async (req, res, next) => {
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if(rol.role !== rolesList.SuperUser){
            res.status(401).json({
                message:'unauthorized'
            });
        }
        const Client = model.getClientModel();
        const cli = Client.findById(req.params.id);
        if(!cli){
            res.status(404).json({
                message:'client doesnot exist'
            });
        }
        
        if (req.value.body.name && req.value.body.name !== '') {
            cli.name = req.value.body.name;
        }
        if (req.value.body.description && req.value.body.description !== '') {
            cli.description = req.value.body.description;
        }
        if (req.value.body.phone && req.value.body.phone !== '') {
            cli.phone = req.value.body.phone;
        }
        if (req.value.body.email && req.value.body.email !== '') {
            cli.email = req.value.body.email;
        }
        if (req.value.body.address && req.value.body.address !== '') {
            cli.address = req.value.body.address;
        }
        const c = await Client.updateOne({ _id: req.params.id }, cli);
        if (c) {
            res.status(200).json({
                message: 'role updated successfully'
            });
        }
        res.status(500).json({
            message: 'error in updating role'
        });
    },
    delete: async (req, res, next) => {
        const Role = model.getRoleModel();
        const rol = Role.findById(req.user.role);
        if(rol.role !== rolesList.SuperUser){
            res.status(401).json({
                message:'unauthorized'
            });
        }
        const CLient = model.getClientModel();
        const resp = await CLient.remove({ _id: req.params.id });
        if (resp.deletedCount > 0) {
            res.status(200).json({
                message: 'client deleted successfully'
            });
        }
        res.status(404).json({
            message:'client doesnot exist'
        });
    }
}