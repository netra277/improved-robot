const Joi = require('joi')

module.exports = {
    validateBody: (schema) => {
        return (req,res,next) => {

            if(!req.value){
                req.value ={};
            }
            req.value['body'] = req.body;
            // Use below when validation is implemented
            
            // const result = Joi.validate(req.body,schema);
            // if(result.error){
            //     return res.status(400).json(result.error);
            // }

            // if(!req.value){
            //     req.value ={};
            // }
            // req.value['body'] = result.value;
            
            
            next();
        }
    },
    schemas:{
        changeAdminPasswordSchema: Joi.object().keys({
            name: Joi.string().min(4).required(),
            phone: Joi.string().required().regex(/^[0-9]{10,10}$/),
            birth_year : Joi.string().required().regex(/^[0-9]{4,4}$/),
            address: Joi.string().required(),
            number_of_devices: Joi.string().required().regex(/^[1-9]/)
        })
    }
}