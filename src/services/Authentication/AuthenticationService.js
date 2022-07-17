const dbconnection = require('../dbConnection/dbConnectionService');
const responseMessages = require('../../utils/responseMessages')
const jwt = require('jsonwebtoken');
const jwt_secret_key = require("../../config/jwt_config");
const keyGenerator = require('../../helpers/keyGenerator');
const md5 = require('md5');

exports.register = async (username, password, phone_number, email_address, profile_picture, birth_date) => {
    try {
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
        await utils.errorLog("authentication-service-register", error.message, error);
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

        await utils.errorLog("authentication-service-login", error.message, error);

    }
}

exports.today = async () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return (`${yyyy}-${mm}-${dd}`);
};

exports.forgetPassword = async (email_address) => {
    const checkUser = await this.checkUser(null, email_address, null);
    try {
        if (checkUser === null) {
            return { status: false, message: responseMessages.forget_password_error[100] };
        } else {
            const today = (await this.today()).toString();
            const key = await keyGenerator.randomkey();
            console.log(key);
            console.log(md5(key))
            let query = "INSERT INTO VerifyCodePool(email_address,verify_code,verify_date) VALUES ('" + email_address + "' , '" + md5(key) + "','" + today + "')";
            dbconnection.query(query, (err, result) => {
                if (err) throw err;
                return ({ status: false, message: responseMessages.forget_password_error[100] })

            });
            return ({ status: true, message: responseMessages.forget_password_success[100] })
        }
    } catch (error) {
        await utils.errorLog("authentication-service-forget-password", error.message, error);
    }
}


exports.verifyCode = async (email_address, verify_code) => {
    try {
        let query1 = "SELECT * FROM VerifyCodePool WHERE email_address = '" + email_address + "' AND verify_code = '" + md5(verify_code) + "'";
        if (this.isValidVerifyCode()) {
            
        }
        
        
        return new Promise(function (resolve, reject) {
            dbconnection.query(query1, (err, result) => {
                if (err) throw err;
                console.log(result)
                if (result.length === 0) {
                    resolve({ status: false, message: responseMessages.forget_password_error[101] })
                }
                else {
                    resolve({ status: true, message: responseMessages.forget_password_success[101] })
                }
            });
        })
        
    } catch (error) {
        
    }
    
}



exports.isValidVerifyCode = async (email_address, verify_code) => {
    /* ! BURADA GONDERILEN KODUN ZAMANININ BITIP BITMEDIGINI KONTROL EDIYORUM!
    */
    
    

}








/**
 * 
{
    "username": "tronho",
    "password": "q12332sdas1ss",
    "phone_number": "054sdsaad18008741",
    "email_address": "eneasdadssakbal00@gmail.com",
    "profile_picture": "12wasdgfdagadf",
    "birth_date": "2001/07/29"
}



INSERT INTO `Users` (`PK_user_id`, `username`, `password_`, `zeta_point`, `phone_number`, `email_address`, `profile_picture`, `birth_date`, `verify_phone_number`, `verify_email_address`, `account_created_time`) VALUES (NULL, 'enesakbl', 'q123321ss', '1000', '05418008741', 'eneasakbal00@gmail.com', NULL, '2001-07-29', '0', '0', '2022-07-16');
 */