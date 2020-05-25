const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const constants = require('../constants/enums');
const Role = model.getRoleModel();

module.exports = {
    create: async (req, res, next) => {
        const reqData = req.body;
        
    }
}