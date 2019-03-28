const httpStatus = require('http-status');
const uuid = require('uuid/v4');
const Article = require('../models/article.model');
const sluglify = require('../helpers/sluglify');
const filterObject = require('../helpers/filterObject');
const ApiError = require('../helpers/APIError');
const _ = require('lodash');

/**
* load Catalogues by page and filters
* @return {Catalogue[]}
*/
function get(req, res, next) {
	let { per_page = 10, page = 1 } = req.query;
	per_page = parseInt(per_page);
	page = parseInt(page);

	Article.find({})
		.sort({ publicatedAt: -1 })
		.skip((page - 1) * per_page)
		.limit(per_page)
		.populate('author', 'name')
		.then((articleList) => {
			Article.find({}).count((err, count) => {
				if (err) throw new ApiError('Some count article error', 500, true);

				res.send({
					items: articleList,
					currentPage: page,
					isLast: page >= Math.ceil(count / per_page),
					total: count,
				});
			})
		})
		.catch((e) => { next(e); });
}

function getArticle(req, res, next) {
	const { params: { slug } } = req;

	Article.find({ slug })
		.populate('author', 'name')
		.then((article) => {
			res.send({
				data: article
			});
		})
		.catch(e => next(e));
}

/**
* add New Catalogue to DB
* @return {null}
*/
function create(req, res, next) {
	const { user: { userId }, body } = req;
	const filterBody = filterObject(body, [
		'title', 'text', 'image'
	]);

	const newArticle = new Article({
		...filterBody,
		slug: `${sluglify(filterBody.title)}-${uuid()}`,
		author: userId,
		isPublished: true,
	});

	return newArticle.save()
		.then(() => res.sendStatus(httpStatus.OK))
		.catch(e => next(e));
}

/**
* remove Catalogue from DB by id
* @return {null}
*/
function remove(req, res, next) {
	const { params: { slug } } = req;

	Article.findOneAndRemove({ slug }, (err) => {
		if (err) return next(err);

		res.sendStatus(httpStatus.OK);
	});
}

/**
* update Catalogue's Name by id
* @return {null}
*/
function update(req, res, next) {
	const { params: { slug }, body } = req;
	const filterBody = filterObject(body, [
		'title', 'text', 'image', 'isPublished', 'publicatedAt'
	]);

	Article.findOneAndUpdate({ slug }, { $set: { ...body } }, (err) => {
		if (err) return next(err);

		return res.sendStatus(httpStatus.OK);
	});
}

function createComment(req, res, next) {
	const { body, user: { userId } } = req;
	const filterBody = filterObject(body, [ 'article_id', 'comment' ]);

	const newComment = {
		comment: filterBody.comment,
		author: userId,
		id: uuid()
	};

	Article.findOneAndUpdate({ _id: filterBody.article_id }, { $push: { comments: newComment } })
		.then(()=> {
			res.sendStatus(200);
		})
		.catch(e => next(e));
}

function removeComment(req, res, next) {
	const { params: { id } } = req;

	Article.findOneAndUpdate({ 'comments.id': id }, { $pull: { comments: { id: id } } })
		.then(() => {
			res.sendStatus(200);
		})
		.catch(e => next(e));
}

function gqlCreateArticle(params, context) {
	const filterBody = filterObject(params, [
		'title', 'text', 'image'
	]);

	const newArticle = new Article({
		...filterBody,
		slug: `${sluglify(filterBody.title)}-${uuid()}`,
		author: context.user.userId,
		isPublished: true,
	});

	return newArticle.save();
}

function gqlUpdateArticle(params, context) {
	let filterBody = filterObject(params, [
		'title', 'text', 'image', 'isPublished', 'publicatedAt'
	]);

	filterBody = _.pickBy(filterBody, (val) => !_.isNil(val));

	return Article.findOneAndUpdate({ slug: params.slug }, { $set: { ...filterBody } });
}

function gqlUpdateArticle(params, context) {
	let filterBody = filterObject(params, [
		'title', 'text', 'image', 'isPublished', 'publicatedAt'
	]);

	filterBody = _.pickBy(filterBody, (val) => !_.isNil(val));

	return Article.findOneAndUpdate({ slug: params.slug }, { $set: { ...filterBody } });
}

function gqlDeleteArticle(params, context) {
	return Article.findOneAndRemove({ slug: params.slug });
}

function gqlAddComment(params, context) {
	const filterBody = filterObject(body, ['article_id', 'comment']);

	const newComment = {
		comment: filterBody.comment,
		author: userId,
		id: uuid()
	};

	return Article.findOneAndUpdate({ _id: filterBody.article_id }, { $push: { comments: newComment } });
}

function gqlRemoveComment(params){
	return Article.findOneAndUpdate({
		'comments.id': params.commentID
	}, {
		$pull: { comments: { id: commentID } }
	});
}

module.exports = {
	get,
	getArticle,
	create,
	remove,
	update,
	createComment,
	removeComment,
	gqlCreateArticle,
	gqlUpdateArticle,
	gqlDeleteArticle,
	gqlAddComment,
	gqlRemoveComment
};
