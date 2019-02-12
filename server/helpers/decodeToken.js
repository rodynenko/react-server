const config = require('../../config/config');
const jwt = require('jsonwebtoken');

const decodeToken = token => new Promise((res, rej) => {
	jwt.verify(token, config.jwtSecret, (err, decoded) => {
		if (err) return rej(err);

		return res(decoded);
	});
});

module.exports = {
	decodeToken
};
