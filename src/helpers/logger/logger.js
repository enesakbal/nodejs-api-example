const { createLogger, format, transports } = require('winston');
// const  yazi =`{"level":"${level}","service":"${service}","functionName:":"${functionName}","requestBody":${JSON.stringify(requestBody)},"status":"${status}","message":${JSON.stringify(message)},"timestamp":"${timestamp}"}`;

const customFormat = format.combine(
    format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    format.json(),
    format.printf(({ level, service, functionName, requestBody, status, message, timestamp }) => {
        return `{"level":"${level}","service":"${service}","functionName:":"${functionName}","requestBody":${JSON.stringify(requestBody)},"status":"${status}","message":${JSON.stringify(message)},"timestamp":"${timestamp}"}`;
    }),
    format.prettyPrint(),


);


const logger = (service, functionName, requestBody, status) => {
    return createLogger({
        level: 'debug',
        format: customFormat,
        defaultMeta: {
            service: service ?? 'Service is empty.',
            functionName: functionName ?? 'Function Name is empty.',
            requestBody: requestBody ?? 'Request Body is empty.',
            status: status
        },
        transports: [
            new transports.File({
                filename: 'logs/authentication/info.log',
                level: 'info',
                maxsize: 104857600, // 100M
                maxFiles: 50,
                tailable: true,
            }),
            new transports.File({
                filename: 'logs/authentication/error.log',
                level: 'error',
                maxsize: 104857600, // 100M
                maxFiles: 50,
                tailable: true
            }),
            new transports.File({
                filename: 'logs/authentication/warn.log',
                level: 'warn',
                maxsize: 104857600, // 100M
                maxFiles: 50,
                tailable: true
            }),
            new transports.File({
                filename: 'logs/authentication/combined.log',
                maxsize: 104857600, // 100M
                maxFiles: 50,
                tailable: true
            }),
            new transports.Console()
        ]
    });
}

module.exports = logger;