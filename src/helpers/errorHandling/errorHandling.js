const logger = require("../logger/logger")

exports.errorHandling = (err, req, res, next) => {

    if (err.success) return next(err);

    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    const errorService = err.service || "Service is not found";

    const errorRequestBody = err.requestBody;
    const errorFunctionName = err.functionName;

    //todo logları burda tutmak oldukça mantıklı olacaktır.
    logger(errorService, errorFunctionName, errorRequestBody,errorStatus).log('error', errorMessage)

    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        service: errorService,
        message: errorMessage
    });

}