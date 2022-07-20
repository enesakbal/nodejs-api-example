const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../../../controllers/Authentication/forgetPasswordController/forgetPasswordController');

router.post('/forgetpassword', forgetPasswordController.forgetPassword)
router.post('/updatepassword', forgetPasswordController.updatePassword)


module.exports = router;