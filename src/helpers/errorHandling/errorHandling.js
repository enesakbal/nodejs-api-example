exports.errorHandling = (err, req, res, next) => {

    if (err.success) return next(err);


    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    
    //todo logları burda tutmak oldukça mantıklı olacaktır.

    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
    });
}