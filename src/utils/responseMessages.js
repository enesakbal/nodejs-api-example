const responseMessages = {
    "register_success": {
        "100": "Hesabınız başarıyla oluşturulmuştur. E-postanıza yönlendirilen aktivasyon mailini doğrulayınız.",
        
    },
    "register_error": {
        "100": "Bu kullanıcı adı kullanılmaktadır.",
        "101": "Bu email adresi kullanılmaktadır. Lütfen hesabınıza giriş yapınız.",
        "102": "Bu telefon numarası ile kayıt olunmuştur. Lütfen hesabınıza giriş yapınız."

    },
    "login_success": {
        "100": "Giriş başarılı.",

    },
    "login_error": {
        "100": "E-posta veya şifreniz hatalı. Lütfen bilgilerinizi kontrol ederek tekrar deneyiniz.",
    },
    "forget_password_success": {
        "100": "E-postanıza şifre yenileme kodu gönderilmiştir.",
        "101": "Email doğrulaması başarılı."
    }
    ,
    "forget_password_error": {
        "100": "Kullanıcı bulunamadı. Email adresinizi kontrol ediniz.",
        "101": "Girmiş olduğunuz kod eşleşmiyor. Lütfen e-postanıza gelen kodu kontrol ediniz.",

        
    }

}

module.exports = responseMessages;