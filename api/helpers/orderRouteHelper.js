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
        createOrderSchema: Joi.object().keys({
            itemCode: Joi.string().alphanum().min(4).max(4).required(),
            name: Joi.string().required(),
            categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            description: Joi.string(),
            price: Joi.number().required(),
            itemImage: Joi.string()
        }),
        updateOrderSchema: Joi.object().keys({
            categoryId:  Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            name: Joi.string(),
            description: Joi.string(),
            price: Joi.number(),
            isHeadBranch: Joi.boolean()
        })
    }
}