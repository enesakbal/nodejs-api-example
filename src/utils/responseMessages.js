const responseMessages = {
    "register_success": {
        "created_account": "Hesabınız başarıyla oluşturulmuştur. E-postanıza yönlendirilen aktivasyon mailini doğrulayınız.",
        
    },
    "register_error": {
        "already_exists_username": "Bu kullanıcı adı kullanılmaktadır.",
        "already_exists_email": "Bu email adresi kullanılmaktadır. Lütfen hesabınıza giriş yapınız.",        
    },
    "login_success": {
        "login_successfully": "Giriş başarılı.",

    },
    "login_error": {
        "invalid_email_or_password": "E-posta veya şifreniz hatalı. Lütfen bilgilerinizi kontrol ederek tekrar deneyiniz.",
    },
    "forget_password_success": {
        "code_sent_successfully": "E-postanıza şifre yenileme kodu gönderilmiştir.",
        "101": "Email doğrulaması başarılı.",
        "code_is_valid": "Şifre yenileme kodu geçerli.",
        "reset_successfully": "Şifreniz başarıyla yenilenmiştir."
    }
    ,
    "forget_password_error": {
        "not_found_email_address": "Kullanıcı bulunamadı. Email adresinizi kontrol ediniz.",
        "incorret_code": "Girmiş olduğunuz kod eşleşmiyor. Lütfen e-postanıza gelen kodu kontrol ediniz.",
        "expired_code": "Girmiş olduğunuz kodun süresi dolmuştur lütfen tekrar deneyiniz.",
        "an_unknown_error_occurred": "Bir hata meydana geldi. Lütfen tekrar deneyiniz."
        
    }

}

module.exports = responseMessages;