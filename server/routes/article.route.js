const express = require('express');
const expressJwt = require('../helpers/expressJWT');
const validate = require('express-validation');
const config = require('../../config/config');
const paramValidation = require('../../config/param-validation');
const articleCtrl = require('../controllers/article.controller');

const router = express.Router(); // eslint-disable-line new-cap

/*
 * Legacy API
 * but it has to work
 */

router.route('/get')
	.get(articleCtrl.get);

router.route('/create')
	.post(
		expressJwt({ secret: config.jwtSecret }),
		validate(paramValidation.articleAdd),
		articleCtrl.create
	);

router.route('/remove/:slug')
	.delete(expressJwt({ secret: config.jwtSecret }), articleCtrl.remove);

router.route('/update/:slug').put(
	expressJwt({ secret: config.jwtSecret }),
	validate(paramValidation.articleUpdate),
	articleCtrl.update
);

router.route('/get/:slug')
	.get(articleCtrl.getArticle);

/*
 * End of Legacy API
 */

router.route('/')
	.get(articleCtrl.get)
	.post(
		expressJwt({ secret: config.jwtSecret }),
		validate(paramValidation.articleAdd),
		articleCtrl.create
	);

router.route('/:slug')
	.get(articleCtrl.getArticle)
	.delete(
		expressJwt({ secret: config.jwtSecret }),
		articleCtrl.remove
	)
	.put(
		expressJwt({ secret: config.jwtSecret }),
		validate(paramValidation.articleUpdate),
		articleCtrl.update
	);

router.use((req, res) => {
	res.sendStatus(404);
});

module.exports = router;
