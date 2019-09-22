module.exports = {
    info:{
        title: 'D-EPOS Swagger API',
        version:'1.0.0',
        description:'endpoints to test routes'
    },
    host:'localhost:3003',
    basePath:'/',
    securityDefinitions:{
        bearerAuth:{
            type:'apiKey',
            name:'Authorization',
            scheme:'bearer',
            in:'header'
        }
    }
}