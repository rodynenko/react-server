const { gql } = require('apollo-server');
const Article = require('../models/article.model');
const User = require('../models/user.model');
const { getGraphQLContext, authenticated } = require('./context');
const { graphQLSignin, graphQLSignup } = require('../controllers/auth.controller');

const typeDefs = gql`
	type Query {
		article(slug: String!): Article
		articles(perPage: Int, page: Int): [Article]
		userDetails: User
	}

	type Mutation {
		createArticle(title: String!, text: String!, image: String): Article
		deleteArticle(slug: String!)
		updateArticle(title: String!, text: String!, image: String, isPublished: Boolean, publicatedAt: String): Article
		addComment(articleId: ID!, comment: String!)
		removeComment(commentID: ID!)
		login(email: String!, password: String!): AuthResponse
		signup(email: String!, password: String!, name: String!): AuthResponse
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
		comments: [Comment]
	}

	type User {
		id: ID!
		name: String
		email: String
	}

	type Comment {
		id: ID!
		author: User
		comment: String
	}

	type AuthResponse {
		token: String
		ttl: Number
		account: User
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
		},
		userDetails: authenticated((_, args, context) =>
			User.findOne({ _id: context.user.userId })),
	},
	Article: {
		author: _ => User.findOne({ _id: _.author[0] })
	},
	Comment: {
		author: _ => User.findOne({ _id: _.author[0] })
	},
	AuthResponse: {
		author: _ => User.findOne({ _id: _.author[0] })
	},

	Mutation: {
		createArticle: authenticated(),
		deleteArticle: authenticated(),
		updateArticle: authenticated(),
		addComment: authenticated(),
		removeComment: authenticated(),
		login: (_, args) => graphQLSignin(args),
		signup: (_, args) => graphQLSignup(args),
	}
};

module.exports = {
	typeDefs,
	resolvers,
	context: getGraphQLContext
};
