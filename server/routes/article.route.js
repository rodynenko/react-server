const express = require('express');
const expressJwt = require('express-jwt');
const validate = require('express-validation');
const config = require('../../config/config');
const paramValidation = require('../../config/param-validation');
const articleCtrl = require('../controllers/article.controller');

const router = express.Router(); // eslint-disable-line new-cap

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

router.use((req, res) => {
	res.sendStatus(404);
});

module.exports = router;
