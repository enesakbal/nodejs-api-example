const dotenv = require("dotenv")
dotenv.config();

const mail_config = {

    host: process.env.HOST_NAME,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }

}

module.exports = mail_config;