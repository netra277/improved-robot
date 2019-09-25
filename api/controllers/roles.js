const connection = require('../dbconnections/db_connection_common');
const roleSchema = require('../models/roles');
module.exports= {
    getRoles: async(req, res, next)=>{
        const con = connection.connectToDatabase();
        const c = con.model('r',roleSchema);
        const roles = await c.find({});
        res.status(200).json(roles);
    }
}