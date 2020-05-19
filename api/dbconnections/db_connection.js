const mongoose = require('mongoose');
const config = require('../configuration/config');
var connections = {};
const options = { useUnifiedTopology: true,useNewUrlParser: true };
module.exports = {
    connectToClientDatabase(clientId){
        if(clientId === null || clientId === undefined){
            return null
        }
        if(config.environment === 'DEVELOPMENT'){
            const clientDatabase = config.connectionStringClientDbDev + clientId;
            if(connections[clientDatabase]){
                return connections[clientDatabase];
            }
            else{
                connections[clientDatabase] = mongoose.createConnection(clientDatabase,options);
                return connections[clientDatabase];
            }
        }
        else{
            const clientDatabase = config.connectionStringClientDb + clientId;
            if(connections[clientDatabase]){
                return connections[clientDatabase];
            }
            else{
                connections[clientDatabase] = mongoose.createConnection(clientDatabase,options);
                return connections[clientDatabase];
            }
        }
    },
    disconnectToDatabase(){
        mongoose.disconnect();
    },
    connectToDatabase(){
        if(config.environment === 'DEVELOPMENT'){
           return mongoose.createConnection(config.connectionStringCommonDbDev,options);
        }
        else{
           return mongoose.createConnection(config.connectionStringCommonDb,options);
        }
    }
}