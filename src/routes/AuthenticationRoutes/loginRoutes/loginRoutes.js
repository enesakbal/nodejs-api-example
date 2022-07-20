const express = require('express');
const router = express.Router();
const loginController = require('../../../controllers/Authentication/loginController/loginController');

router.post('/', loginController.login)


module.exports = router;