const httpStatus = require('http-status');
const md5 = require('md5');
const passwordSchema = require("../../../schemas/forget_password/forget_password_schema")
const forgetPasswordService = require('../../../services/AuthenticationServices/forgetPasswordService/forgetPasswordService');
const { createError } = require("../../../helpers/errorHandling/createError");

exports.forgetPassword = async (req, res, next) => {
    const error = passwordSchema.forgetPasswordSchema().validate(req.body).error;
    if (error)
        return next(createError({ status: httpStatus.BAD_REQUEST, message: error.details[0].message }))
    
    const response = await forgetPasswordService.forgetPassword(req.body.email_address);
    // console.log(response)
    //todo burada mail göndermeliyim
    return next(response)
}


exports.updatePassword = async (req, res, next) => {
    const error = passwordSchema.updatePasswordSchema().validate(req.body).error
    if (error) {
        return next(createError({ status: httpStatus.BAD_REQUEST, message: error.details[0].message }))
    }
    const response =
        await forgetPasswordService.updatePassword(
            req.body.email_address,
            md5(req.body.verify_code),
            md5(req.body.password)
        );
    // console.log(response);
    
    return next(response)

}

