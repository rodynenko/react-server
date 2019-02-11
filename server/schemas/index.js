const { gql } = require('apollo-server');
const Article = require('../models/article.model');
const User = require('../models/user.model');

const typeDefs = gql`
	type Query {
		article(slug: String!): Article
		articles(perPage: Int, page: Int): [Article]
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
		author: User
		comments: [String]
	}

	type User {
		id: ID!
		name: String
		email: String
	}
`;

const resolvers = {
	Query: {
		article: (_, { slug }) => Article.findOne({ slug }),
		articles: (_, { perPage = 10, page = 1 }) => {
			const _perPage = Math.max(parseInt(perPage, 10), 5);
			const _page = Math.max(parseInt(page, 10));

			return Article.find()
			.sort({ publicatedAt: -1 })
			.skip((_page - 1) * _perPage)
			.limit(_perPage);
		}
	},
	Article: {
		author: _ => User.findOne({ _id: _.author[0] })
	}
};

module.exports = {
	typeDefs,
	resolvers
};
