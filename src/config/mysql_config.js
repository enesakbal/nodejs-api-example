const dotenv = require("dotenv")
dotenv.config();

const mysql_config = {
    
        host: process.env.HOST,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        waitForConnections: true,
    
};

module.exports = mysql_config;