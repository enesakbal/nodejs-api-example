const dbConnection = require('../dbConnection/dbConnectionService');

exports.randomkey = async () => {
    const generate_key = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return generate_key;
};

exports.today = async () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return (created_date = `${yyyy}-${mm}-${dd}`);
};