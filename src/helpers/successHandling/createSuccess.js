exports.createSuccess = (content) => {
    // console.log(content)
    statuscode = content.status ?? 200
    service = content.service ?? 'Not found service'
    // console.log(statuscode)

    const success = {
        success: true,
        status: statuscode,
        service: service,
        ...content
    }
    return success;
};


