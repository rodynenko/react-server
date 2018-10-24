const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('../controllers/auth.controller');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/signin')
	.post(validate(paramValidation.signIn), authCtrl.signin);

router.route('/signup')
	.post(validate(paramValidation.signUp), authCtrl.signup);

router.route('/restore-password')
	.post(authCtrl.restorePassword);

router.use((req, res) => {
	res.sendStatus(404);
});

module.exports = router;
