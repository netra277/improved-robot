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
        createCategorySchema: Joi.object().keys({
            categoryId: Joi.string().alphanum().min(4).max(4).required(),
            name: Joi.string().required(),
            description: Joi.string()
        }),
        updateCategorySchema: Joi.object().keys({
            branchId: Joi.string().alphanum().min(6).max(6).required(),
            phone: Joi.string().regex(/^[0-9]{10,10}$/),
            email: Joi.string().email(),
            name: Joi.string(),
            Address: Joi.string(),
            GSTNumber: Joi.string(),
            isHeadBranch: Joi.boolean()
        })
    }
}