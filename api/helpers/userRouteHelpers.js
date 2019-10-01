const Joi = require('joi')

module.exports = {
    validateBody: (schema) => {
        return (req,res,next) => {
            const result = Joi.validate(req.body,schema);
            if(result.error){
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
        createUserSchema: Joi.object().keys({
            username: Joi.string().alphanum().min(6).max(12).required(),
            password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
            repeat_password: Joi.ref('password'),
            name: Joi.string().required(),
            phone: Joi.string().required().regex(/^[0-9]{10,10}$/),
            email: Joi.string().email().required(),
            role: Joi.string().required(),
            status: Joi.string().required(),
            clientId: Joi.string().required()
        }),
        authSchema: Joi.object().keys({
            username: Joi.string().alphanum().min(6).max(12).required(),
            password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/)
        })
    }
}