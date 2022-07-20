const httpStatus = require('http-status');
const registerSchema = require("../../../schemas/register/register_schema");
const md5 = require('md5');
const { createError } = require('../../../helpers/errorHandling/createError');


const registerService = require('../../../services/AuthenticationServices/registerService/registerService');


exports.register = async (req, res, next) => {
    const error = registerSchema.validate(req.body).error
    if (error)
        return next(createError({ status: httpStatus.BAD_REQUEST, message: error.details[0].message }))
    // return res.status(httpStatus.BAD_REQUEST).send({ status: false, message: error.details[0].message })

    const response =
        await registerService.register(
            req.body.username,
            md5(req.body.password),
            req.body.email_address,
            req.body.profile_picture,
            req.body.birth_date,
            req.body.gender
        );
    console.log("31231");
    return next(response)


}