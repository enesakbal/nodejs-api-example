const { createError } = require('../errorHandling/createError');
const httpStatus = require('http-status');
const dbconnection = require('../../services/dbConnectionService/dbConnectionService');


exports.dbErrorHandling = (req, res, next) => {
    dbconnection.getConnection((err, conn) => {
        if (err) {
            return next(createError({ status: httpStatus.INTERNAL_SERVER_ERROR, service: 'dbconnection service', message: { message1: 'Something went wrong!', message2: err } }))
        }
        next();
    })
}