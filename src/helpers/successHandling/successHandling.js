const { x } = require("joi");
const logger = require("../logger/logger")

exports.successHandling = (err, req, res, next) => {

    const status = err.status;
    const service = err.service;
    const message = err.message;
    const token= err.token
    const requestBody = err.requestBody;
    const functionName = err.functionName;

    logger(service, functionName, requestBody, status).log('info', message);
    return res.status(status).json({
        success: true,
        status: status,
        service: service,
        message: message,
        token: token 
    })
}