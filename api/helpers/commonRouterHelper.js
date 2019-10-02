const Joi = require('joi');

module.exports = {
    validateParam: (schema, paramName) => {
        return (req, res, next) => {
            console.log('req: ', req['params'][paramName]);
            const result = Joi.validate({ param: req['params'][paramName] }, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            }
            if (!req.value) {
                req.value = { params: {} };
            }
            req.value['params'][paramName] = result.value.param;
            console.log('end validateParam');
            next();
        }
    },
    paramSchemas: {
        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        })
    }
}