const express = require('express');
const apiEndpoint = require('./src/routes/api');
const app = express();

app.use(express.json());



app.use('/api', apiEndpoint);


app.listen(3000,  async () => {8
    //todo zamanı parse edip database e kaydet daha sonra doğrulama kodunun tarihi ile karşılaştır en son olarak servisi biraz test et. OK


    //todo gerekli schemaların oluşturulması ve joi ile validate edilmesi. WAITING
    //todo register aktivasyon kodu gönderme WAITING
    //todo email servisinin yazılması WAITING
    //todo middleware tam olarak nedir onun araştırılması şart çok tekrara düşüyorsun. WAITING
    //todo next nedir nasıl kullanılır. WAITING

})






// ONCE SERVICE YAZILIR SONRA CONTROLLER YAZILIR EN SON ROUTESA GİDER.