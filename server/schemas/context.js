const { decodeToken } = require('../helpers/decodeToken');
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
		throw new Error('Unauthorized!');
	}

	return next(root, args, context, info);
};

module.export = {
	getGraphQLContext,
	authenticated
};
