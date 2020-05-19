const Joi = require('joi')

module.exports = {
    validateBody: (schema) => {
        return (req,res,next) => {
            const result = Joi.validate(req.body,schema);
            if(result.error){
                console.log('error',result.error);
                return res.status(400).json(result.error);
            }
            if(!req.value){
                req.value ={};
            }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas:{
        createClientSchema: Joi.object().keys({
            clientId: Joi.string().alphanum().min(6).max(6).required(),
            name: Joi.string().min(5).max(50).required(),
            description: Joi.string().min(5).max(200).required(),
            phone: Joi.string().required().regex(/^[0-9]{10,10}$/),
            email: Joi.string().email().required(),
            address: Joi.string().required(),
            status: Joi.string().required()
        }),
        updateClientSchema: Joi.object().keys({
            clientId: Joi.string().alphanum().min(6).max(6).required(),
            name: Joi.string().min(5).max(50),
            description: Joi.string().min(5).max(200),
            phone: Joi.string().regex(/^[0-9]{10,10}$/),
            email: Joi.string().email(),
            address: Joi.string()
        })
    }
}