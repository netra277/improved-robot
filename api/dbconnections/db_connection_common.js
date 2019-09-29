const mongoose = require('mongoose');
const config = require('../configuration/config');
module.exports = {
    connectToDatabase(){
        if(config.environment === 'DEVELOPMENT'){
           return mongoose.createConnection(config.connectionStringCommonDbDev,{ useUnifiedTopology: true,useNewUrlParser: true });
        }
        else{
           return mongoose.createConnection(config.connectionStringCommonDb,{ useUnifiedTopology: true, useNewUrlParser: true });
        }
    },
    disconnectToDatabase(){
        mongoose.disconnect();
    }
}
