const Joi = require('joi');
const { joiPassword } = require('joi-password');


const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: joiPassword.string().
        minOfUppercase(1).
        minOfNumeric(2).
        required(),
    email_address: Joi.string().
        email().
        required(),
    profile_picture: Joi.string(),
    birth_date: Joi.date().required(),
    gender: Joi.string().required()
});

module.exports = schema;