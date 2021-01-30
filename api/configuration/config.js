const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.APP_PORT,
    jwtSecretKey: process.env.JWT_SECRET,
    environment: process.env.APP_ENV,
    connectionStringCommonDbDev: process.env.CONNECTION_STRING_COMMON_DEV,
    connectionStringClientDbDev: process.env.CONNECTION_STRING_CLIENT_DEV,
    connectionStringCommonDb: process.env.CONNECTION_STRING_COMMON,
    connectionStringClientDb: process.env.CONNECTION_STRING_CLIENT,
    setupUser: process.env.SETUP_UN,
    setupPwd: process.env.SETUP_PW
}