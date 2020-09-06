const express = require('express');
const expressJwt = require('../helpers/expressJWT');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const config = require('../../config/config');
const articleCtrl = require('../controllers/article.controller');

const router = express.Router(); // eslint-disable-line new-cap

/*
 * Legacy API
 * but it has to work
 */

router.route('/create')
	.post(
		expressJwt({ secret: config.jwtSecret }),
		validate(paramValidation.commentAdd),
		articleCtrl.createComment
	);

router.route('/remove/:id')
	.delete(expressJwt({ secret: config.jwtSecret }), articleCtrl.removeComment);

/*
 * End of Legacy API
 */

router.route('/')
	.post(
		expressJwt({ secret: config.jwtSecret }),
		validate(paramValidation.commentAdd),
		articleCtrl.createComment
	);

router.route('/:id')
	.delete(expressJwt({ secret: config.jwtSecret }), articleCtrl.removeComment);

router.use((req, res) => {
	res.sendStatus(404);
});

module.exports = router;
