
const connection = require('../dbconnections/db_connection');
const ClientSchema = require('../db-models/clients');
const RoleSchema = require('../db-models/roles');
const AdminUserSchema = require('../db-models/admin-users');
const UserSchema = require('../db-models/users');
const BranchSchema = require('../db-models/client-models/branch');
const CategorySchema = require('../db-models/client-models/category');
const ItemSchema = require('../db-models/client-models/item');
const BranchUserSchema = require('../db-models/client-models/branch-user');
const OrdersSchema = require('../db-models/client-models/orders');
const RegisteredUserSchema = require('../db-models/client-models/registered-user');
const mongooModels = require('../constants/mongoose-models');

module.exports = {
  getAdminUserModel(){
    const con = connection.connectToDatabase();
    return con.model(mongooModels.AdminUsersModel,AdminUserSchema);
  },
  getUserModel() {
    const con = connection.connectToDatabase();
    return con.model(mongooModels.UsersModel, UserSchema);
  },
  getClientModel() {
    const con = connection.connectToDatabase();
    return con.model(mongooModels.ClientsModel, ClientSchema);
  },
  getRoleModel() {
    const con = connection.connectToDatabase();
    return con.model(mongooModels.RolesModel, RoleSchema);
  },
  getBranchModel(clientId) {
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToDatabase(id);
    return cliConnect.model(mongooModels.BranchesModel, BranchSchema);
  },
  getCategoryModel(clientId) {
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToDatabase(id);
    return cliConnect.model(mongooModels.CategoryModel, CategorySchema);
  },
  getBranchUserModel(clientId) {
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToDatabase(id);
    return cliConnect.model(mongooModels.BranchUserModel, BranchUserSchema);
  },
  getItemsModel(clientId) {
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToDatabase(id);
    return cliConnect.model(mongooModels.ItemsModel, ItemSchema);
  },
  getOrdersModel(clientId) {
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToDatabase(id);
    return cliConnect.model(mongooModels.OrdersModel, OrdersSchema);
  },
  getOrderDetailsModel(clientId) {
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToDatabase(id);
    return cliConnect.model(mongooModels.ItemsModel, ItemSchema);
  },
  getRegisteredUsersModel(clientId) {
    const id = clientId.toUpperCase();
    const cliConnect = connection.connectToDatabase(id);
    return cliConnect.model(mongooModels.RegisteredUserModel,RegisteredUserSchema);
  }
}