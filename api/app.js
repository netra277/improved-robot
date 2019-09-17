const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//below apiAuthentication is the daabase name it will automatically create 
mongoose.connect('mongodb://localhost/apiAuthentication')

const app = express();

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
//Routes
app.use('/users',require('./routes/users'));

//start the server with port

const port = process.env.PORT || 3033;
app.listen(port);
console.log(`Server is listening on port: ${port}`);