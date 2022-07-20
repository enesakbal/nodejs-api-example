const dbconnection = require('../../../services/dbConnectionService/dbConnectionService');
const httpStatus = require('http-status');

const jwt = require('jsonwebtoken');

const jwt_secret_key = require("../../../config/jwt_config");

const responseMessages = require('../../../utils/responseMessages');

const { createSuccess } = require('../../../helpers/successHandling/createSuccess');
const { createError } = require("../../../helpers/errorHandling/createError");


exports.login = async (email_address, password) => {
    try {
        return new Promise(function (resolve, reject) {
            let query = "SELECT * FROM Users WHERE " +
                "email_address = '" + email_address +
                "' AND " +
                "password_ = '" + password + "'";
            dbconnection.query(query, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    const token = jwt.sign(
                        {
                            id: result[0].PK_user_id,
                            username: result[0].username,
                            zeta_point: result[0].zeta_point,
                            email_address: result[0].email_address,
                            profile_picture: result[0].profile_picture,
                            birth_date: result[0].birth_date,
                            gender: result[0].gender,
                            verify_email_address: result[0].verify_email_address,
                            account_created_time: result[0].account_created_time
                        },
                        jwt_secret_key,
                        { expiresIn: '180d' }
                    );
                    return resolve(createSuccess({ message: responseMessages.login_success.login_successfully, token }));
                } else {
                    return resolve(createError({ status: httpStatus.BAD_REQUEST, message: responseMessages.login_error.invalid_email_or_password }))
                }
            });
        })
    } catch (error) {
        console.log(error)
        return resolve(createError(error))
    }
}