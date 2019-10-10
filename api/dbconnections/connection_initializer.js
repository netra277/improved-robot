
const connection = require('../dbconnections/db_connection_common');
const clientDbConnection = require('../dbconnections/db_connection_client');
const ClientSchema = require('../models/clients');
const RoleSchema = require('../models/roles');
const UserSchema = require('../models/users');
const BranchSchema = require('../models/client-models/branch');
const CategorySchema = require('../models/client-models/category');
const ItemSchema = require('../models/client-models/item');
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
    },
    getBranchModel(clientId){
      const id = clientId.toLowerCase();
      const cliConnect = clientDbConnection.connectToDatabase(id);
      return cliConnect.model(mongooModels.BranchesModel,BranchSchema);
    },
    getCategoryModel(clientId){
      const id = clientId.toLowerCase();
      const cliConnect = clientDbConnection.connectToDatabase(id);
      return cliConnect.model(mongooModels.CategoryModel,CategorySchema);
    },
    getBranchUserModel(clientId){
      const id = clientId.toLowerCase();
      const cliConnect = clientDbConnection.connectToDatabase(id);
      return cliConnect.model(mongooModels.BranchUserDetailModel, BranchUserSchema)
    },
    getItemsModel(clientId){
      const id = clientId.toLowerCase();
      const cliConnect = clientDbConnection.connectToDatabase(id);
      return cliConnect.model(mongooModels.ItemsModel, ItemSchema)
    },
    getOrdersModel(clientId){
      const id = clientId.toLowerCase();
      const cliConnect = clientDbConnection.connectToDatabase(id);
      return cliConnect.model(mongooModels.ItemsModel, ItemSchema)
    },
    getOrderDetailsModel(clientId){
      const id = clientId.toLowerCase();
      const cliConnect = clientDbConnection.connectToDatabase(id);
      return cliConnect.model(mongooModels.ItemsModel, ItemSchema)
    }
}