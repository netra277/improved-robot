const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./configuration/config');
const swaggerDefinition = require('./configuration/swagger-definition');

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
};


mongoose.Promise = global.Promise;

//below is the database name it will automatically create 
// if(config.environment === "DEVELOPMENT"){
//     mongoose.connect('mongodb://localhost/epos_common_dev',{ useNewUrlParser: true,useUnifiedTopology: true });
// }else {
//     mongoose.connect('mongodb://localhost/epos',{
//         useNewUrlParser: true,
//         useUnifiedTopology: true 
//     });
// }


const app = express();

// swagger config start
const swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json', function(req,res){
 res.setHeader('Content-Type','application/json');
 res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerSpec));
// swagger config end


//middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// cors 
// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Headers','Origin','X-Requested-With, Content-Type, Accept, Authorization');
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//         return res.status(200).json({});
//     }
//     next();
// })

app.use(cors());

//Routes
app.use('/auth',require('./routes/authentication'));
app.use('/users',require('./routes/users'));
app.use('/clients',require('./routes/clients'));
app.use('/roles', require('./routes/roles'));
app.use('/branches', require('./routes/branches'));
app.use('/categories', require('./routes/category'));
app.use('/items', require('./routes/items'));
app.use('/orders', require('./routes/orders'));

// Error handling
app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
        
    });
});

module.exports = app;

