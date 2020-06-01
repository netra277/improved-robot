
const connection = require('../dbconnections/db_connection');
//const clientConnection = require('../dbconnections/db-connection-client');
const ClientSchema = require('../db-models/clientsModel');
const RoleSchema = require('../db-models/rolesModel');
const ClientDevicesSchema = require('../db-models/client-devices');
const AdminUserSchema = require('../db-models/admin-usersModel');
const BranchSchema = require('../db-models/client-models/branchesModel');
const CategorySchema = require('../db-models/client-models/categoriesModel');
const ItemSchema = require('../db-models/client-models/ItemsModel');
const OrdersSchema = require('../db-models/client-models/ordersModel');
const UsersSchema = require('../db-models/client-models/usersModel');
const mongooModels = require('../constants/mongoose-models');
const DevicesSchema = require('../db-models/client-models/devicesModel');
const DeviceKeysSchema = require('../db-models/device-keysModel');

module.exports = {
  getAdminUserModel() {
    const con = connection.connectToDatabase();
    return con.model(mongooModels.AdminUsersModel, AdminUserSchema);
  },
  getClientModel() {
    const con = connection.connectToDatabase();
    return con.model(mongooModels.ClientsModel, ClientSchema);
  },
  getRoleModel() {
    const con = connection.connectToDatabase();
    return con.model(mongooModels.RolesModel, RoleSchema);
  },
  getClientDevicesModel(){
    const con = connection.connectToDatabase();
    return con.model(mongooModels.DevicesModel,ClientDevicesSchema);
  },
  getDeviceKeysModel(){
    const con = connection.connectToDatabase();
    return con.model(mongooModels.DeviceKeysModel,DeviceKeysSchema);
  },
  getBranchModel(clientId) {
    if(!clientId){
      return null;
    }
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToClientDatabase(id);
    return cliConnect.model(mongooModels.BranchesModel, BranchSchema);
  },
  getCategoryModel(clientId) {
    if(!clientId){
      return null;
    }
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToClientDatabase(id);
    return cliConnect.model(mongooModels.CategoryModel, CategorySchema);
  },
  getItemsModel(clientId) {
    if(!clientId){
      return null;
    }
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToClientDatabase(id);
    return cliConnect.model(mongooModels.ItemsModel, ItemSchema);
  },
  getOrdersModel(clientId) {
    if (!clientId) {
      return null;
    }
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToClientDatabase(id);
    return cliConnect.model(mongooModels.OrdersModel, OrdersSchema);
  },
  getOrderDetailsModel(clientId) {
    if (!clientId) {
      return null;
    }
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToClientDatabase(id);
    return cliConnect.model(mongooModels.ItemsModel, ItemSchema);
    
  },
  getUserModel(clientId) {
    if (!clientId) {
      return null;
    }
      const id = clientId.toUpperCase();
      const cliConnect = connection.connectToClientDatabase(id);
      return cliConnect.model(mongooModels.UsersModel, UsersSchema);
  },
  getDevicesModel(clientId) {
    if (!clientId) {
      return null;
    }
      const id = clientId.toUpperCase();
      const cliConnect = connection.connectToClientDatabase(id);
      return cliConnect.model(mongooModels.DevicesModel, DevicesSchema);
  }
}