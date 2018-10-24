const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const articleRoutes = require('./article.route');
const commentRoutes = require('./comment.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
	res.send('OK')
);

router.use('/user', userRoutes);

router.use('/auth', authRoutes);

router.use('/article', articleRoutes);

router.use('/comment', commentRoutes);

module.exports = router;
