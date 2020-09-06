const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const User = require('../models/user.model');
const ApiError = require('../helpers/APIError');

/**
 * Returns jwt token and account info if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function signin(req, res, next) {
	const { body } = req;

	User.findOne({ email: body.email })
		.then((user) => {
			if (!user) return next(new ApiError('No account with this email', 500, true));

			if (user.authenticate(body.password)) {
				const token = jwt.sign({
					email: user.email,
					userId: user._id,
				}, config.jwtSecret);

				return res.json({
					token,
					ttl: 86400,
					account: {
						email: user.email,
						name: user.name,
					}
				});
			}

			return next(new ApiError('Not valid password', 500, true));
		});
}

// const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
// return next(err);

function signup(req, res, next) {
	const { body } = req;

	User.findOne({ email: body.email })
		.then((user) => {
			if (user) throw new ApiError('User with this email has already exist', 500, true);

			const newUser = new User({
				email: body.email,
				name: body.name,
				salt: User.makeSalt(),
			});

			newUser.password = newUser.encryptPassword(body.password);

			return newUser.save()
				.then((savedUser) => {
					const { name, email, _id } = savedUser;
					const token = jwt.sign({
						email,
						userId: _id,
					}, config.jwtSecret);

					res.json({
						token,
						ttl: 86400,
						account: {
							email,
							name,
						}
					});
				});
		})
		.catch(e => next(e));
}

function restorePassword(req, res, next) {
	const { body } = req;
	const password = Math.random().toString(36).slice(2, 8);

	User.findOne({ email: body.email })
		.then((user) => {
			if (!user) throw new Error(`There are not user with email: ${body.email}`, 500, true);

			user.password = user.encryptPassword(password); // eslint-disable-line
			return user;
		})
		.then(user => user.save())
		.then(() => {
			res.sendStatus(200);
		})
		.catch(e => next(e));
}

function graphQLSignin(params) {
	return User.findOne({ email: params.email })
		.then((user) => {
			if (!user) return new ApiError('No account with this email', 500);

			if (user.authenticate(params.password)) {
				const token = jwt.sign({
					email: user.email,
					userId: user._id,
				}, config.jwtSecret);

				return {
					token,
					ttl: 86400,
					account: {
						email: user.email,
						name: user.name,
					}
				};
			}

			return new ApiError('Not valid password', 500);
		});
}

function graphQLSignup(params) {
	return User.findOne({ email: params.email })
		.then((user) => {
			if (user) throw new ApiError('User with this email has already exist', 500);

			const newUser = new User({
				email: params.email,
				name: params.name,
				salt: User.makeSalt(),
			});

			newUser.password = newUser.encryptPassword(params.password);

			return newUser.save()
				.then((savedUser) => {
					const { name, email, _id } = savedUser;
					const token = jwt.sign({
						email,
						userId: _id,
					}, config.jwtSecret);

					return ({
						token,
						ttl: 86400,
						account: {
							email,
							name,
						}
					});
				});
		});
}

module.exports = {
	signin,
	signup,
	restorePassword,
	graphQLSignin,
	graphQLSignup
};
