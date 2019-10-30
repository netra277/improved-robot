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
            paymentDetails: Joi.object().keys({
                amount: Joi.number().required(),
                discountPercentage: Joi.number().required(),
                discountAmount: Joi.number().required(),
                amountAfterDiscount: Joi.number().required(),
                mode: Joi.string(),
                particulars: Joi.object().keys({
                    cash: Joi.string().optional(),
                    debitcard: Joi.string().optional(),
                    creditcard: Joi.string().optional(),
                    upi: Joi.string().optional()
                })
            }),
            branchId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            createdByUserId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            itemsList: Joi.array().items(
                Joi.object().keys({
                    itemId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    quantity: Joi.number().required()
                })
            ),
            customerDetails: Joi.object().keys({
                name: Joi.string(),
                phone: Joi.number(),
                address: Joi.string()
            })
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