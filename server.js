const express = require('express');
const helmet = require('helmet');
const nodeMailer = require("nodemailer");

const { dbErrorHandling } = require('./src/helpers/dbErrorsHandling/dbErrorsHandling');
const { errorHandling } = require('./src/helpers/errorHandling/errorHandling');
const { successHandling } = require('./src/helpers/successHandling/successHandling');



const apiEndpoint = require('./src/routes/api');
const sendEmail = require('./src/services/MailService/mailService');
const app = express();
app.use(helmet());


app.use(express.json());



app.use(dbErrorHandling)
app.use('/varmisin/api', apiEndpoint);
app.use(errorHandling);
app.use(successHandling)

app.post('/send-email', function (req, res) {
    sendEmail(req.body.email_address)
});



app.listen(3000, async () => {
    //todo zamanı parse edip database e kaydet daha sonra doğrulama kodunun tarihi ile karşılaştır en son olarak servisi biraz test et. OK
    //todo gerekli schemaların oluşturulması ve joi ile validate edilmesi. WAITING => OK
    //todo register aktivasyon kodu gönderme WAITING WAITING
    //todo email servisinin yazılması WAITING => OK
    //todo middleware tam olarak nedir onun araştırılması şart çok tekrara düşüyorsun. WAITING WAITING OK
    //todo next nedir nasıl kullanılır. WAITINGWAITING  OK
})






// ONCE SERVICE YAZILIR SONRA CONTROLLER YAZILIR EN SON ROUTESA GİDER.