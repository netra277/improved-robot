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
        createRoleSchema: Joi.object().keys({
            role: Joi.string().required(),
            description: Joi.string().min(5).max(200).required(),
            isClientLevel: Joi.boolean() 
        }),
        updateRoleSchema: Joi.object().keys({
            description: Joi.string()
        })
    }
}