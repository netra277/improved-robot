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
        createBranchSchema: Joi.object().keys({
            branchId: Joi.string().alphanum().min(6).max(6).required(),
            name: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
            Address: Joi.string().required(),
            phone: Joi.string().required().regex(/^[0-9]{10,10}$/),
            email: Joi.string().email().required(),
            GSTNumber: Joi.string(),
            isHeadBranch: Joi.boolean().required(),
            useHeadBranchGST: Joi.boolean().required()
        }),
        updateBranchSchema: Joi.object().keys({
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