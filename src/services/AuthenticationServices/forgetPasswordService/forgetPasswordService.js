const dbConnection = require('../../../services/dbConnectionService/dbConnectionService');
const httpStatus = require('http-status');
const md5 = require('md5');

const responseMessages = require('../../../utils/responseMessages');

const keyGenerator = require('../../../helpers/keyGenerator');
const dateManager = require('../../../helpers/dateManager');
const { createSuccess } = require('../../../helpers/successHandling/createSuccess');
const { createError } = require("../../../helpers/errorHandling/createError");





exports.forgetPassword = async (email_address) => {
    const checkUser = await this.checkUser(email_address);
    console.log("check user : " + checkUser)

    try {
        if (checkUser === null) {
            return createError({ status: httpStatus.NOT_FOUND, message: responseMessages.forget_password_error.not_found_email_address });
        } else {
            await this.checkSentCode(email_address);


            const todayWithTime = await dateManager.todayWithTime();
            const key = await keyGenerator.randomkey();
            console.log("verify code :" + key);
            console.log("verify code :" + md5(key));
            let query = "INSERT INTO VerifyCodePool(email_address,verify_code,verify_date) VALUES ('" + email_address + "' , '" + md5(key) + "','" + todayWithTime + "')";
            return new Promise(function (resolve, reject) {
                dbConnection.query(query, (err, result) => {
                    if (err) throw err;

                    if (result.length === 0)
                        return resolve(createError({ status: httpStatus.INTERNAL_SERVER_ERROR, message: responseMessages.forget_password_error.an_unknown_error_occurred }))

                    else
                        return resolve(createSuccess({ message: responseMessages.forget_password_success.code_sent_successfully }))
                });
            });
        }
    } catch (error) {
        console.log(error)
        return resolve(createError(error))
    }
}


exports.checkUser = async (email_address) => {
    let query = "SELECT email_address FROM Users WHERE email_address = '" + email_address + "'";
    return new Promise(function (resolve, reject) {
        dbConnection.query(query, function (err, result) {
            if (err) throw err;
            result.map(value => {
                if (value.email_address === email_address) {
                    resolve(true)
                }
            })
            resolve(null);
        }
        );
    });
};


exports.checkSentCode = async (email_address) => {
    //VerifyCodePool tablosunda birden fazla aynnı kayıt olmasın diye böyle bir şey yaptım
    //zaten bunu yapmasam yine de çalışmayacaktı çünkü email_address primary key olarak kayıtlı.
    //dolayısıyla bir email_address den yalnızca bir tane olabilir.
    try {
        let query = "SELECT verify_date FROM VerifyCodePool WHERE email_address = '" + email_address + "'";
        return new Promise(function (resolve, reject) {
            dbConnection.query(query, async (err, result) => {
                if (err) throw err;
                console.log("daha önceden gönderilmiş kod : " + (result.length > 0))
                if (result.length === 0) {
                    resolve(null);
                } else {
                    resolve(true)
                }
            })
        }).then((response) => {
            //buradaki response resolveun içindekileri aynen geri verir
            //sanırım burada responsun yanına error yazıp reject ile komtrol edebilirim.
            if (response) {
                let query = "DELETE FROM VerifyCodePool WHERE email_address = '" + email_address + "'";
                dbConnection.query(query, async (err, result) => {
                    if (err) throw err;
                    console.log({ status: true, message: "Var olan kod silinmiştir." })
                });
            }
        })

    } catch (error) {
        console.log(error)
        return resolve(createError(error))
    }
}


/************************************************************************************************************************************************************************************* */

exports.updatePassword = async (email_address, verify_code, password) => {
    try {
        const verifyCode = await this.verifyCode(email_address, verify_code)
        console.log("is valid verifyCode : " + (verifyCode.success))
        if (verifyCode.success === undefined) {
            return verifyCode;
        }
        let query =
            "UPDATE Users u JOIN VerifyCodePool vcp ON " +
            "(u.email_address = vcp.email_address) " +
            "SET u.password_ = '" + password + "' " +
            "WHERE vcp.verify_code = '" + verify_code + "' AND " +
            "vcp.email_address = '" + email_address + "' AND " +
            "u.email_address = '" + email_address + "'";
        return new Promise(async function (resolve, reject) {
            dbConnection.query(query, async (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                    return resolve(createError({ status: httpStatus.INTERNAL_SERVER_ERROR, message: responseMessages.forget_password_error.an_unknown_error_occurred }))

                } else {

                    return resolve(createSuccess({ message: responseMessages.forget_password_success.reset_successfully }))

                }
            })
        }).then((response) => {
            //şifre değiştirme işlemi başarılı ise VerifyCodePool tablosunda veri tutulmasına gerek yoktur.
            if (response.status) {
                let query = "DELETE FROM VerifyCodePool WHERE email_address = '" + email_address + "'";
                dbConnection.query(query, async (err, result) => {
                    if (err) throw err;
                });
                return response;
            }


        });
    } catch (error) {
        console.log(error)
        return resolve(createError(error))
    }
}





//email yanlış verilemez.
exports.verifyCode = async (email_address, verify_code) => {
    try {
        let query1 = "SELECT verify_date FROM VerifyCodePool WHERE email_address = '" + email_address + "' AND verify_code = '" + verify_code + "'";
        return new Promise(async function (resolve, reject) {
            dbConnection.query(query1, async (err, result) => {
                if (err) throw err;
                console.log("result : " + result)
                if (result.length === 0) {
                    return resolve(createError({ status: httpStatus.FORBIDDEN, message: responseMessages.forget_password_error.incorret_code }))

                }
                else {
                    //bu noktada kod ve email doğru girilmiştir.
                    let verify_date = result[0].verify_date;
                    const diffrence = await dateManager.differenceDatesAndToday(verify_date.toUTCString());

                    //5 dakika olayı burada
                    if (diffrence > 65.0) {
                        return resolve(createError({ status: httpStatus.GONE, message: responseMessages.forget_password_error.expired_code }))

                    } else {

                        return resolve(createSuccess({ message: responseMessages.forget_password_success.code_is_valid }))

                    }
                }
            })
        })
    } catch (error) {
        console.log(error)
        return resolve(createError(error))
    }
}




