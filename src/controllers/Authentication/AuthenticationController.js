const authService = require('../../services/Authentication/AuthenticationService');
const httpStatus = require('http-status');


const registerSchema = require("../../schemas/register/register_schema");
const loginSchema = require("../../schemas/login/login_schema");
const passwordSchema = require("../../schemas/forget_password/forget_password_schema")


const md5 = require('md5');

exports.register = async (req, res, next) => {
    const error = registerSchema.validate(req.body).error
    if (error)
        return res.status(httpStatus.BAD_REQUEST).send({ status: false, message: error.details[0].message })

    const rp =
        await authService.register(
            req.body.username,
            md5(req.body.password),
            req.body.email_address,
            req.body.profile_picture,
            req.body.birth_date,
            req.body.gender
        );
    console.log(rp)
    if (rp.status) {
        return res.status(httpStatus.OK).send(rp)
    } else {
        return res.status(httpStatus.FORBIDDEN).send(rp)
    }


}


exports.login = async (req, res, next) => {
    const error = loginSchema.validate(req.body).error
    if (error)
        return res.status(httpStatus.BAD_REQUEST).send({ status: false, message: error.details[0].message })

    const rp =
        await authService.login(
            req.body.email_address,
            md5(req.body.password)
        );

    console.log(rp)

    if (rp.status) {
        return res.status(httpStatus.OK).send(rp)
    } else {
        return res.status(httpStatus.UNAUTHORIZED).send(rp)

    }


}

exports.forgetPassword = async (req, res, next) => {
    const error = passwordSchema.forgetPasswordSchema().validate(req.body).error;
    if (error)
        return res.status(httpStatus.BAD_REQUEST).send({ status: false, message: error.details[0].message })

    const rp = await authService.forgetPassword(req.body.email_address);
    console.log(rp)

    //todo burada mail göndermeliyim
    return res.status(httpStatus.OK).send(rp)

}


exports.updatePassword = async (req, res, next) => {
    const error = passwordSchema.updatePasswordSchema().validate(req.body).error
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).send({ status: false, message: error.details[0].message })

    }
    const rp =
        await authService.updatePassword(
            req.body.email_address,
            md5(req.body.verify_code),
            md5(req.body.password)
        );
    if (rp.status) {
        return res.status(httpStatus.OK).send(rp)
    } else {
        return res.status(httpStatus.NOT_FOUND).send(rp)
    }

}



exports.getAllUsers = async (req, res, next) => {
    const rp = await authService.getAllUsers();
    console.log(rp)
    return res.status(httpStatus.OK).send(rp)
}


/**
 * 
 * 
 * 
 * {
    "username": "tronho",
    "password": "q123321ss",
    "phone_number": "052389912331",
    "email_address": "tronhoenes@gmail.com",
    "profile_picture": "12wasdgfdagadf",
    "birth_date": "2001/07/29"
}
 */