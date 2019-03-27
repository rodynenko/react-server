const { decodeToken } = require('../helpers/decodeToken');
const { AuthorizationError } = require('apollo-server');
const HEADER_NAME = 'authorization';

const getGraphQLContext = async ({ req }) => {
	let authToken = null;
	let currentUser = null;

	try {
		authToken = req.headers[HEADER_NAME].substr(7);
		currentUser = await decodeToken(authToken);
	} catch (e) {
		console.warn(e);
	}

	return {
		user: currentUser
	}
}

const authenticated = next => (root, args, context, info) => {
	if (!context.user) {
		throw new AuthorizationError('you must be logged in');
	}

	return next(root, args, context, info);
};

module.export = {
	getGraphQLContext,
	authenticated
};
