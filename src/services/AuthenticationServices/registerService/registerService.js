const dbconnection = require('../../../services/dbConnectionService/dbConnectionService');
const httpStatus = require('http-status');

const responseMessages = require('../../../utils/responseMessages')

const dateManager = require('../../../helpers/dateManager')
const { createSuccess } = require('../../../helpers/successHandling/createSuccess');
const { createError } = require("../../../helpers/errorHandling/createError");

exports.register = async (username, password, email_address, profile_picture, birth_date, gender) => {
    try {
        console.log(dateManager.today().toString());
        const checkUser = await this.checkUser(username, email_address);
        if (!checkUser) {
            let query =
                "INSERT INTO `Users` (`username`, `password_`, `email_address`, `profile_picture`, `birth_date`,`gender`) VALUES" +
                `('${username}','${password}','${email_address}','${profile_picture}','${birth_date}','${gender}')`;

            return new Promise(function (resolve, reject) {
                dbconnection.query(query, (err, result) => {
                    if (err) throw err;
                });
                return resolve(createSuccess({ status: httpStatus.CREATED, message: responseMessages.register_success.created_account }))

            });
        } else {
            return checkUser;
        }
    } catch (error) {
        console.log(error)
        return resolve(createError(error))
    }

}


exports.checkUser = async (username, email_address) => {
    let query = "SELECT email_address,username FROM Users WHERE email_address = '" + email_address + "' OR username = '" + username + "'";
    return new Promise(function (resolve, reject) {
        dbconnection.query(query, function (err, result) {
            if (err) throw err;
            //map olmasının nedeni birden fazla sonuç gelebilir.
            result.map(value => {
                if (value.username === username) {
                    return   resolve(createError({ status: httpStatus.FORBIDDEN, message: responseMessages.register_error.already_exists_username }))
                } else if (value.email_address === email_address) {
                    return   resolve(createError({ status: httpStatus.FORBIDDEN, message: responseMessages.register_error.already_exists_email }))

                }
            })
            return resolve(null);
        }
        );
    });
};
