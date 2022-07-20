const express = require('express');
const router = express.Router();
const loginEndPoint = require('./AuthenticationRoutes/loginRoutes/loginRoutes');
const registerEndPoint = require('./AuthenticationRoutes/registerRoutes/registerRoutes');
const forgetPasswordEndPoint = require('./AuthenticationRoutes/forgetPasswordRoutes/forgetPasswordRoutes');




router.use('/auth/login', loginEndPoint);
router.use('/auth/register', registerEndPoint);
router.use('/auth/password',forgetPasswordEndPoint)






module.exports = router;