const nodeMailer = require("nodemailer");
const mail_config = require("../../config/mail_config");

exports.sendVerifyCodeToEmail = (email_address, key) => {
    let transporter = nodeMailer.createTransport(mail_config);
    let mailOptions = {
        from: mail_config.auth.user,
        to: email_address,
        subject: 'deneme',
        text: `<h1>${key}<h1>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(info);
    });
}




