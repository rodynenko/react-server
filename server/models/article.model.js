const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
	title: String,
	text: String,
	image: String,
	createAt: { type: Date, default: Date.now },
	isPublished: Boolean,
	publicatedAt: { type: Date, default: Date.now },
	slug: String,
	author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	comments: []
});

module.exports = mongoose.model('Article', ArticleSchema);
