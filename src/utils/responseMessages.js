const responseMessages = {
    "register_success": {
        "register_created_account": "Hesabınız başarıyla oluşturulmuştur. E-postanıza yönlendirilen aktivasyon mailini doğrulayınız.",
        
    },
    "register_error": {
        "register_already_exists_username": "Bu kullanıcı adı kullanılmaktadır.",
        "register_already_exists_email": "Bu email adresi kullanılmaktadır. Lütfen hesabınıza giriş yapınız.",
        "register_already_exists_phone_number": "Bu telefon numarası ile kayıt olunmuştur. Lütfen hesabınıza giriş yapınız."
        
    },
    "login_success": {
        "login_successfully": "Giriş başarılı.",

    },
    "login_error": {
        "login_error_invalid_email_or_password": "E-posta veya şifreniz hatalı. Lütfen bilgilerinizi kontrol ederek tekrar deneyiniz.",
    },
    "forget_password_success": {
        "forget_password_code_sent_successfully": "E-postanıza şifre yenileme kodu gönderilmiştir.",
        "101": "Email doğrulaması başarılı.",
        "forget_password_code_is_valid": "Şifre yenileme kodu geçerli.",
        "forget_password_reset_successfully": "Şifreniz başarıyla yenilenmiştir."
    }
    ,
    "forget_password_error": {
        "forget_password_not_found_email_address": "Kullanıcı bulunamadı. Email adresinizi kontrol ediniz.",
        "forget_password_incorret_code": "Girmiş olduğunuz kod eşleşmiyor. Lütfen e-postanıza gelen kodu kontrol ediniz.",
        "forget_password_expired_code": "Girmiş olduğunuz kodun süresi dolmuştur lütfen tekrar deneyiniz.",
        "forget_password_an_unknown_error_occurred": "Bir hata meydana geldi. Lütfen tekrar deneyiniz."
        
    }

}

module.exports = responseMessages;