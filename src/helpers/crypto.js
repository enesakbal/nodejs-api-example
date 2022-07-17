const CryptoJS = require('crypto-js');
const dotenv = require("dotenv")
dotenv.config();
const secret = process.env.SECRET_KEY;


exports.encrypt = (param) => {
    try {
        const ciphertext = CryptoJS.AES.encrypt(
            param,
            secret
        ).toString();

        return ciphertext;
    } catch (error) {
        return error;
    }
};

exports.decrypt = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    } catch (error) {
        return error;
    }
};
