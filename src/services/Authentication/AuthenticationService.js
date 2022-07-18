const dbconnection = require('../dbConnection/dbConnectionService');
const responseMessages = require('../../utils/responseMessages')
const jwt = require('jsonwebtoken');
const jwt_secret_key = require("../../config/jwt_config");
const keyGenerator = require('../../helpers/keyGenerator');
const datamanager = require('../../helpers/dateManager')
const md5 = require('md5');

exports.register = async (username, password, email_address, profile_picture, birth_date, gender) => {
    try {
        console.log(datamanager.today().toString());
        const checkUser = await this.checkUser(username, email_address);
        if (!checkUser) {
            let query =
                "INSERT INTO `Users` (`username`, `password_`, `email_address`, `profile_picture`, `birth_date`,`gender`) VALUES" +
                `('${username}','${password}','${email_address}','${profile_picture}','${birth_date}','${gender}')`;

            return new Promise(function (resolve, reject) {
                dbconnection.query(query, (err, result) => {
                    if (err) throw err;
                    console.log(result);
                });
                resolve({
                    status: true,
                    message: responseMessages.register_success.register_created_account
                });
            });
        } else {
            return checkUser;
        }
    } catch (error) {
        console.error(error)
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
                    resolve({ status: false, message: responseMessages.register_error.register_already_exists_username })
                } else if (value.email_address === email_address) {
                    resolve({ status: false, message: responseMessages.register_error.register_already_exists_email })
                }
            })
            resolve(null);
        }
        );
    });
};



exports.getAllUsers = async () => {
    let query = "SELECT * FROM Users";
    // silinecek
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
                                email_address: result[0].email_address,
                                profile_picture: result[0].profile_picture,
                                birth_date: result[0].birth_date,
                                gender: result[0].gender,
                                verify_email_address: result[0].verify_email_address,
                                account_created_time: result[0].account_created_time
                            },
                            jwt_secret_key,
                            { expiresIn: '180d' }
                        )
                        console.log(token);
                        resolve({ status: true, message: responseMessages.login_success.login_successfully, token, id: result[0].PK_user_id })
                    } else {
                        resolve({ status: false, message: responseMessages.login_error.login_error_invalid_email_or_password })
                    }
                });
            })
        }
    } catch (error) {
        console.error(error)
    }
}


exports.checkSentCode = async (email_address) => {
    //VerifyCodePool tablosunda birden fazla aynnı kayıt olmasın diye böyle bir şey yaptım
    //zaten bunu yapmasam yine de çalışmayacaktı çünkü email_address primary key olarak kayıtlı.
    //dolayısıyla bir email_address den yalnızca bir tane olabilir.
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
            //buradaki response resolveun içindekileri aynen geri verir
            //sanırım burada responsun yanına error yazıp reject ile komtrol edebilirim.
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
            return { status: false, message: responseMessages.forget_password_error.forget_password_not_found_email_address };
        } else {
            await this.checkSentCode(email_address);


            const todayWithTime = await datamanager.todayWithTime();
            const key = await keyGenerator.randomkey();
            console.log("verify code :" + key);
            console.log("verify code :" + md5(key));
            let query = "INSERT INTO VerifyCodePool(email_address,verify_code,verify_date) VALUES ('" + email_address + "' , '" + md5(key) + "','" + todayWithTime + "')";
            return new Promise(function (resolve, reject) {
                dbconnection.query(query, (err, result) => {
                    if (err) throw err;

                    if (result.length === 0)
                        resolve({ status: false, message: responseMessages.forget_password_error.forget_password_an_unknown_error_occurred })

                    else
                        resolve({ status: true, message: responseMessages.forget_password_success.forget_password_code_sent_successfully })
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
                    resolve({ status: false, message: responseMessages.forget_password_error.forget_password_incorret_code })
                }
                else {
                    //bu noktada kod ve email doğru girilmiştir.
                    let verify_date = result[0].verify_date;
                    const diffrence = await datamanager.differenceDatesAndToday(verify_date.toUTCString());

                    //5 dakika olayı burada
                    if (diffrence > 5.0) {
                        resolve({ status: false, message: responseMessages.forget_password_error.forget_password_expired_code })
                    } else {
                        resolve({ status: true, message: responseMessages.forget_password_success.forget_password_code_is_valid })
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
                    resolve({ status: false, message: responseMessages.forget_password_error.forget_password_an_unknown_error_occurred })
                } else {
                    resolve({ status: true, message: responseMessages.forget_password_success.forget_password_reset_successfully })
                }
            })
        }).then((response) => {
            //şifre değiştirme işlemi başarılı ise VerifyCodePool tablosunda veri tutulmasına gerek yoktur.
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