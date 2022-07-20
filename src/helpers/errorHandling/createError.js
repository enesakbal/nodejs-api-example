exports.createError = (content) => {
    const err = new Error();
    console.log(content);
    err.status = content.status || null;
    err.message = content.message || "try catchde hata var";
    return err;
};


