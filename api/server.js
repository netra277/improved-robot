const http = require('http');
const app = require('./app');
const config = require('./configuration/config');
//start the server with port
const port = config.port || 3033;
const server = http.createServer(app);
server.listen(port);
console.log(`Server is listening on port: ${port}`);