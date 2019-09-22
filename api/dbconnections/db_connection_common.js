const mongoose = require('mongoose');
const config = require('../configuration/config');
module.exports = {
    connectToDatabase(){
        if(config.environment === 'DEVELOPMENT'){
           return mongoose.createConnection(config.connectionStringCommonDbDev);
        }
        else{
           return mongoose.createConnection(config.connectionStringCommonDb);
        }
    },
    disconnectToDatabase(){
        mongoose.disconnect();
    }
}
