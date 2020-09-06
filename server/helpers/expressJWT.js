const expressJwt = require('express-jwt');

const expressJWT = (options = {}) => expressJwt({
	algorithms: ['HS256'],
	...options
});

module.exports = expressJWT;
