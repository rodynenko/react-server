const express = require('express');
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const userCtrl = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/details')
	.get(expressJwt({ secret: config.jwtSecret }), userCtrl.get);

router.route('/change-password')
	.post(expressJwt({ secret: config.jwtSecret }), userCtrl.changePassword);

router.route('/change-details')
	.post(expressJwt({ secret: config.jwtSecret }), userCtrl.changeDetails);

router.use((req, res) => {
	res.sendStatus(404);
});

module.exports = router;
