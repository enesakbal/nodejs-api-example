exports.successHandling = (err, req, res, next) => {
    
        //todo logları burda tutmak oldukça mantıklı olacaktır.

    return res.send(err)
}