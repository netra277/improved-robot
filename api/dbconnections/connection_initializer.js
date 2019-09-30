
const connection = require('../dbconnections/db_connection_common');
const ClientSchema = require('../models/clients');
const RoleSchema = require('../models/roles');
const UserSchema = require('../models/users');
const mongooModels = require('../commons/mongoose-models');

module.exports = {
    getUserModel(){
        const con = connection.connectToDatabase();
        return con.model(mongooModels.UsersModel,UserSchema);
      },
      getClientModel(){
        const con = connection.connectToDatabase();
        return con.model(mongooModels.ClientsModel,ClientSchema);
      },
      getRoleModel(){
        const con = connection.connectToDatabase();
        return con.model(mongooModels.RolesModel, RoleSchema);
    }
}