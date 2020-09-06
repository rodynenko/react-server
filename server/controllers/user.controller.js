const User = require('../models/user.model');

/**
 * Get user
 * @returns {User}
 */
function get(req, res, next) {
	const { userId } = req.user;

	User.findOne({ _id: userId })
		.select('-_id email name')
		.then((user) => {
			if (user) return res.json(user);
			throw new Error('User not found');
		})
		.catch(e => next(e));
}

/**
* Change user password
* @return {String}
*/
function changePassword(req, res, next) {
	const { body, user: { userId } } = req;

	User.findOne({ _id: userId })
		.then((user) => {
			if (user) {
				// eslint-disable-next-line no-param-reassign
				user.password = user.encryptPassword(body.password);
				return user.save()
					.then(() => res.json({ message: 'Password changed successfully' }));
			}
			throw new Error('user not found');
		})
		.catch(e => next(e));
}

/**
* Change user info details
* @return {*}
*/
function changeDetails(req, res, next) {
	const { body, user: { userId } } = req;

	User.findOne({ _id: userId })
		.then((user) => {
			if (user) {
				// eslint-disable-next-line no-param-reassign
				Object.keys(body).reduce((prev, curr) => (user[curr] = body[curr]));

				return user.save()
					.then(() => res.json({ message: 'Details changed successfully' }));
			}

			throw new Error('user not found');
		})
		.catch(e => next(e));
}

module.exports = {
	get,
	changePassword,
	changeDetails,
};
