const connection = require('../dbconnections/db_connection_common');
const clientSchema = require('../models/clients');
module.exports= {
    getClients: async(req, res, next)=>{
        const con = connection.connectToDatabase();
        const c = con.model('c',clientSchema);
        const clients = await c.find({});
        res.status(200).json(clients);
    }
}