const { gql } = require('apollo-server');
const Article = require('../models/article.model');
const User = require('../models/user.model');

const typeDefs = gql`
	type Query {
		article(slug: String!): Article
	}

	type Article {
		id: ID!
		title: String
		text: String
		image: String
		createAt: String
		isPublished: Boolean
		publicatedAt: String
		slug: String
		author: UserD,
		comments: [String]
	}

	type UserD {
		id: ID!
		name: String
		email: String
	}
`;

const resolvers = {
	Query: {
		article: (_, { slug }) => Article.findOne({ slug })
	},
	Article: {
		author: _ => User.findOne({ _id: _.author[0] })
	}
};

module.exports = {
	typeDefs,
	resolvers
};
