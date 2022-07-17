const express = require('express');
const apiEndpoint = require('./src/routes/api');
const app = express();
app.use(express.json());



app.use('/api', apiEndpoint);


app.listen(3000, () => {8
    //todo zamanı parse edip database e kaydet daha sonra doğrulama kodunun tarihi ile karşılaştır en son olarak servisi biraz test et.
})






// ONCE SERVICE YAZILIR SONRA CONTROLLER YAZILIR EN SON ROUTESA GİDER.