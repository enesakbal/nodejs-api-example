const Joi = require('joi');


const schema = Joi.object().keys({
    email_address: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = schema;