const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.APP_PORT,
    jwtSecretKey: process.env.JWT_SECRET,
    environment: process.env.APP_ENV,
    superUserPassword: process.SUPERUSER_PASSWORD,
    powerUserPassword: process.POWERUSER_PASSWORD,
    connectionStringCommonDbDev: process.env.CONNECTION_STRING_COMMON_DEV,
    connectionStringClientDbDev: process.env.CONNECTION_STRING_CLIENT_DEV,
    connectionStringCommonDb: process.env.CONNECTION_STRING_COMMON,
    connectionStringClientDb: process.env.CONNECTION_STRING_CLIENT,
    clientSecretKey: process.env.CLIENT_SECRET_KEY
}