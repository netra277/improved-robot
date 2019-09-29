const connection = require('../dbconnections/db_connection_common');
const clientSchema = require('../models/clients');
const mongooModels = require('../commons/mongoose-models');
const mongoose = require('mongoose');

module.exports= {
    getClients: async(req, res, next)=>{
        const c = getClientModel();
        const clients = await c.find({});
        res.status(200).json(clients);
    },
    create: async(req,res,next)=>{
        const Client = getClientModel();
        const cli = new Client({
            _id:  new mongoose.Types.ObjectId(),
            clientId: req.body.id,
            name: req.body.name,
            description: req.body.description,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            status: 'active',
            registeredDate: new Date().toISOString(),
            unregisteredDate: ''
        });
        console.log('saving client');
        const c = await cli.save()
        if(c){
            console.log('client created successfully, Id: ',c.id);
            res.status(200).json({
                message: 'client created successfully'
            });
        }
        console.log('No client created');
        res.status(500).json({
            message: 'client doesnot created'
        })
    }
}
function getClientModel(){
    const con = connection.connectToDatabase();
    return con.model(mongooModels.ClientsModel,clientSchema);
}