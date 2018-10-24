const Joi = require('joi');

module.exports = {
	// POST /api/users
	createUser: {
		body: {
			username: Joi.string().required(),
			password: Joi.string().required(),
			company: Joi.string().required()
		}
	},

	// UPDATE /api/users/:userId
	updateUser: {
		body: {
			username: Joi.string().required(),
			mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
		},
		params: {
			userId: Joi.string().hex().required()
		}
	},

	// POST /api/auth/login
	signIn: {
		body: {
			email: Joi.string().email().required(),
			password: Joi.string().alphanum().min(6).required()
		}
	},

	// POST /api/auth/signup
	signUp: {
		body: {
			name: Joi.string().min(2).required(),
			email: Joi.string().email().required(),
			password: Joi.string().alphanum().min(6).required(),
			password_confirm: Joi.string().alphanum().min(6).required(),
		}
	},

	articleAdd: {
		body: {
			title: Joi.string().min(2).required(),
			text: Joi.string().min(2).required(),
			image: Joi.string(),
		}
	},

	articleUpdate: {
		body: {
			title: Joi.string().min(2),
			text: Joi.string().min(2),
			image: Joi.string().uri(),
			isPublished: Joi.boolean(),
			publishedAt: Joi.date(),
		}
	},

	commentAdd: {
		body: {
			article_id: Joi.string().required(),
			comment: Joi.string().required()
		}
	}

};
