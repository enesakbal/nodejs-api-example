exports.createSuccess = (content) => {
    // console.log(content.status)
    statuscode = content.status ?? 200
    // console.log(statuscode)

    const success = {
        success: true,
        status: statuscode,
        ...content
    }
    return success;
};


