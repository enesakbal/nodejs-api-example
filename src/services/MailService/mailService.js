const nodeMailer = require("nodemailer");
const mail_config = require("../../config/mail_config");
const ejs = require("ejs");


exports.sendVerifyCodeToEmail = async (email_address, key) => {
    let transporter = nodeMailer.createTransport(mail_config);
    ejs.renderFile('/Users/enesakbal/Desktop/nodejsapps/varmisinapp/src/utils/verifycodeTemplate.ejs', {email_address: email_address, key: key }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let mailOptions = {
                from: mail_config.auth.user,
                to: email_address,
                subject: 'Var mısın ?',
                html: data

            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }

    });
}




