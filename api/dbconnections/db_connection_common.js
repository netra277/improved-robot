const mongoose = require('mongoose');
const config = require('../configuration/config');
const options = { useUnifiedTopology: true,useNewUrlParser: true };

module.exports = {
    connectToDatabase(){
        if(config.environment === 'DEVELOPMENT'){
           return mongoose.createConnection(config.connectionStringCommonDbDev,options);
        }
        else{
           return mongoose.createConnection(config.connectionStringCommonDb,options);
        }
    },
    disconnectToDatabase(){
        mongoose.disconnect();
    }
}
