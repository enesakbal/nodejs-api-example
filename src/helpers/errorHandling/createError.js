exports.createError = (content) => {
    const err = new Error();
    console.log(content);
    err.status = content.status || null;
    err.message = content.message || null;
    err.service = content.service || null;
    err.requestBody = content.requestBody;
    err.functionName = content.functionName;
    return err;
};


