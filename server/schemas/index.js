const { gql } = require('apollo-server');

const typeDefs = gql`
	type Query {
		hello: String
	}
`;

const resolver = {
	Query: {
		hello: () => 'world'
	}
};

module.exports = {
	typeDefs,
	resolver
};
