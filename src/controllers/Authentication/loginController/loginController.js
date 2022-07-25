const httpStatus = require('http-status');
const loginSchema = require("../../../schemas/login/login_schema");
const md5 = require('md5');
const loginService = require('../../../services/AuthenticationServices/loginService/loginService');
const { createError } = require('../../../helpers/errorHandling/createError');


exports.login = async (req, res, next) => {

    const error = loginSchema.validate(req.body).error
    if (error)
        return next(
            createError({
                status: httpStatus.BAD_REQUEST,
                message: error.details[0].message,
                service: 'login service - validation',
                requestBody: {
                    ...req.body,
                    "password": md5(req.body.password)
                },
                functionName: "login"
            }))
    const response =
        await loginService.login(
            req.body.email_address,
            md5(req.body.password)
        );
    console.log(response)
    return next(response)
}
