const mongoose = require('mongoose');
const config = require('../configuration/config');
var connections = {};
const options = { useUnifiedTopology: true,useNewUrlParser: true, useCreateIndex: true };
module.exports = {
    connectToClientDatabase(clientId){
        if(config.environment === 'DEVELOPMENT'){
            const clientDatabase = config.connectionStringClientDbDev + clientId;
            if(connections[clientDatabase]) {
                connections[clientDatabase].on('connected',()=>{
                    console.log('connected to db: ', clientId);
                });
                connections[clientDatabase].on('disconnected',()=>{
                    console.log('connection disconnected!');
                });
                connections[clientDatabase].on('error',(err)=>{
                    console.log('error connecting mongoose database', err);
                });
                connections[clientDatabase].once('open',()=>{
                    console.log('connection open for db: ', clientId);
                });
                return connections[clientDatabase];
            }
            else {
                connections[clientDatabase] = mongoose.createConnection(clientDatabase,options);
                connections[clientDatabase].on('connected',()=>{
                    console.log('connected to db: ', clientId);
                });
                connections[clientDatabase].on('disconnected',()=>{
                    console.log('connection disconnected');
                });
                connections[clientDatabase].on('error',(err)=>{
                    console.log('error connecting mongoose database', err);
                });
                connections[clientDatabase].once('open',()=>{
                    console.log('connection open for db: ', clientId);
                });
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