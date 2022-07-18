const express = require('express');
const router = express.Router();

const controller = require('../../controllers/Authentication/AuthenticationController');


router.get('/', controller.getAllUsers);

router.post('/register', controller.register);

router.post('/login', controller.login);

router.post('/password/forgetpassword', controller.forgetPassword);
router.post('/password/updatepassword', controller.updatePassword);

// router.post('/try',controller.try)
// router.post('/login/password/checkforgetpassword', controller.checkforgetpassword);
// router.post('/login/password/updatePassword', controller.updatePassword);



module.exports = router;