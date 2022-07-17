const express = require('express');
const router = express.Router();
const authEndpoint = require('./Authentication/authentication');



router.use('/auth', authEndpoint)

module.exports = router;