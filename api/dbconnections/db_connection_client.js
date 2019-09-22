const mongoose = require('mongoose');
const config = require('../configuration/config');
var connections = {};
module.exports = {
    connectToDatabase(clientId){
        if(clientId === null || clientId === undefined){
            return null
        }
        if(config.environment === 'DEVELOPMENT'){
            if(connections[clientId]){
                return connections[clientId];
            }
            else{
                connections[clientId] = mongoose.createConnection(config.connectionStringClientDbDev);
                return connections[clientId];
            }
        }
        else{
            if(connections[clientId]){
                return connections[clientId];
            }
            else{
                connections[clientId] = mongoose.createConnection(config.connectionStringClientDb);
                return connections[clientId];
            }
        }
    },
    disconnectToDatabase(){
        mongoose.disconnect();
    }
}