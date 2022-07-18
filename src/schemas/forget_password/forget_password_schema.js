const Joi = require("joi");
const {joiPassword} =require("joi-password")

exports.forgetPasswordSchema = () => {
    const schema = Joi.object().keys({
        email_address: Joi.string().
            email().
            required(),
    })
    return schema;
}

exports.updatePasswordSchema = () => {
    const schema = Joi.object().keys({
        email_address: Joi.string().
            email().
            required(),
        verify_code: Joi.string().length(6).regex(/^[0-9]+$/),
        password: joiPassword.string().
            minOfUppercase(1).
            minOfNumeric(2).
            required(),        
    })
    return schema;
}
