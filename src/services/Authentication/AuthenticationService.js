const dbconnection = require('../dbConnection/dbConnectionService');
const responseMessages = require('../../utils/responseMessages')
const jwt = require('jsonwebtoken');
const jwt_secret_key = require("../../config/jwt_config");
const keyGenerator = require('../../helpers/keyGenerator');
const datamanager = require('../../helpers/dateManager')
const md5 = require('md5');

exports.register = async (username, password, phone_number, email_address, profile_picture, birth_date) => {
    try {
        console.log(datamanager.today().toString());

        const checkUser = await this.checkUser(username, email_address, phone_number);
        if (!checkUser) {
            let query =
                "INSERT INTO `Users` (`username`, `password_`, `phone_number`, `email_address`, `profile_picture`, `birth_date`) VALUES" +
                `('${username}','${password}','${phone_number}','${email_address}','${profile_picture}','${birth_date}')`;

            dbconnection.query(query, (err, result) => {
                if (err) throw err;
                console.log(result);
            });
            return {
                status: true,
                message: responseMessages.register_success[100]
            };
        } else {
            return checkUser;
        }
    } catch (error) {
        console.error(error)

    }

}


exports.checkUser = async (username, email_address, phone_number) => {
    return new Promise(function (resolve, reject) {
        dbconnection.query(
            "SELECT email_address,username, phone_number FROM Users WHERE email_address = '" + email_address + "' OR username = '" + username + "' OR phone_number ='" + phone_number + "'",
            function (err, result) {
                if (err) throw err;
                result.map(value => {
                    if (value.username === username) {
                        resolve({ status: false, message: responseMessages.register_error[100] })
                    } else if (value.email_address === email_address) {
                        resolve({ status: false, message: responseMessages.register_error[101] })
                    } else if (value.phone_number === phone_number) {
                        resolve({ status: false, message: responseMessages.register_error[102] })
                    }
                })
                resolve(null);
            }
        );
    });
};



exports.getAllUsers = async () => {
    let query = "SELECT * FROM Users";

    return new Promise(function (resolve, reject) {
        dbconnection.query(query, (err, result) => {
            if (err) throw err;
            resolve(result);
        })
    });

}


exports.login = async (email_address, password) => {
    try {
        const checkUser = await this.checkUser(null, email_address, null);
        if (checkUser === null) {
            return { status: false, message: "Kullanıcı bulunamadı" };
            //todo burayı degistir kullanici bulunamadi değil yanlis sifre yap
        } else {
            return new Promise(function (resolve, reject) {
                let query = "SELECT * FROM Users WHERE " +
                    "email_address = '" + email_address +
                    "' AND " +
                    "password_ = '" + password + "'";
                dbconnection.query(query, (err, result) => {
                    if (err) throw err;
                    console.log(result);
                    if (result.length > 0) {
                        console.log(result[0].PK_user_id)
                        const token = jwt.sign(
                            {
                                id: result[0].PK_user_id,
                                username: result[0].username,
                                zeta_point: result[0].zeta_point,
                                phone_number: result[0].phone_number,
                                email_address: result[0].email_address,
                                profile_picture: result[0].profile_picture,
                                birth_date: result[0].birth_date,
                                verify_phone_number: result[0].verify_phone_number,
                                verify_email_address: result[0].verify_email_address,
                                account_created_time: result[0].account_created_time
                            },
                            jwt_secret_key,
                            { expiresIn: '180d' }
                        )
                        console.log(token);
                        resolve({ status: true, message: responseMessages.login_success[100], token, id: result[0].PK_user_id })
                    } else {
                        resolve({ status: false, message: responseMessages.login_error[100] })
                    }
                });
            })
        }
    } catch (error) {
        console.error(error)


    }
}

exports.checkSentCode = async (email_address) => {
    try {
        let query = "SELECT verify_date FROM VerifyCodePool WHERE email_address = '" + email_address + "'";
        return new Promise(function (resolve, reject) {
            dbconnection.query(query, async (err, result) => {
                if (err) throw err;
                console.log(result)
                if (result.length === 0) {
                    resolve(null);
                } else {
                    resolve(true)
                }
            })
        }).then((response) => {
            if (response) {
                let query = "DELETE FROM VerifyCodePool WHERE email_address = '" + email_address + "'";
                dbconnection.query(query, async (err, result) => {
                    if (err) throw err;
                    console.log({ status: true, message: "Var olan kod silinmiştir." })
                });
            }
        })

    } catch (error) {
        console.error(error)

    }
}


exports.forgetPassword = async (email_address) => {
    const checkUser = await this.checkUser(null, email_address, null);

    try {
        if (checkUser === null) {
            return { status: false, message: responseMessages.forget_password_error[100] };
        } else {
            await this.checkSentCode(email_address);

            
            const todayWithTime = await datamanager.todayWithTime();
            const key = await keyGenerator.randomkey();
            console.log(key);
            console.log(md5(key))
            let query = "INSERT INTO VerifyCodePool(email_address,verify_code,verify_date) VALUES ('" + email_address + "' , '" + md5(key) + "','" + todayWithTime + "')";
            return new Promise(function (resolve, reject) {
                dbconnection.query(query, (err, result) => {
                    if (err) throw err;

                    if (result.length === 0)
                        resolve({ status: false, message: responseMessages.forget_password_error[103] })

                    else
                        resolve({ status: true, message: responseMessages.forget_password_success[100] })
                });
            });
        }
    } catch (error) {
        console.error(error)

    }
}



//email yanlış verilemez.
exports.verifyCode = async (email_address, verify_code) => {
    try {
        let query1 = "SELECT verify_date FROM VerifyCodePool WHERE email_address = '" + email_address + "' AND verify_code = '" + verify_code + "'";
        return new Promise(async function (resolve, reject) {
            dbconnection.query(query1, async (err, result) => {
                if (err) throw err;
                console.log(result)
                if (result.length === 0) {
                    resolve({ status: false, message: responseMessages.forget_password_error[101] })
                }
                else {
                    //bu noktada kod ve email doğru girilmiştir.
                    let verify_date = result[0].verify_date;
                    const diffrence = await datamanager.differenceDatesAndToday(verify_date.toUTCString());
                    if (diffrence > 5.0) {
                        resolve({ status: false, message: responseMessages.forget_password_error[102] })
                    } else {
                        resolve({ status: true, message: responseMessages.forget_password_success[102] })
                    }
                }
            })
        })
    } catch (error) {
        console.error(error)

    }
}

exports.updatePassword = async (email_address, verify_code, password) => {
    try {
        const isValid = await this.verifyCode(email_address, verify_code)
        console.log(isValid)
        if (!isValid.status) {
            return isValid;
        }
        let query =
            "UPDATE Users u JOIN VerifyCodePool vcp ON " +
            "(u.email_address = vcp.email_address) " +
            "SET u.password_ = '" + password + "' " +
            "WHERE vcp.verify_code = '" + verify_code + "' AND " +
            "vcp.email_address = '" + email_address + "' AND " +
            "u.email_address = '" + email_address + "'";
        return new Promise(async function (resolve, reject) {
            dbconnection.query(query, async (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                    resolve({ status: false, message: responseMessages.forget_password_error[103] })
                } else {
                    resolve({ status: true, message: responseMessages.forget_password_success[103] })
                }
            })
        }).then((response) => {
            if (response.status) {
                let query = "DELETE FROM VerifyCodePool WHERE email_address = '" + email_address + "'";
                dbconnection.query(query, async (err, result) => {
                    if (err) throw err;
                });
                return response;
            }


        });
    } catch (error) {
        console.error(error)

    }
}
/**
 {

    "username": "tronho",
    "password": "salak524252",
    "phone_number": "05111111111",
    "email_address": "q123321ss@gmail.com",
    "profile_picture": "12wasdgfdagadf",
    "birth_date": "2001/07/29",
    "verify_code": 400160
}

 
 
 
 
 */