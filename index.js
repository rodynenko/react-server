const mongoose = require('mongoose');
const util = require('util');

// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;

if (mongoUri) {
	mongoose.connect(mongoUri, {
		useNewUrlParser: true
	});
	mongoose.connection.on('error', () => {
		throw new Error(`unable to connect to database: ${mongoUri}`);
	});

	// print mongoose logs in dev env
	if (config.MONGOOSE_DEBUG) {
		mongoose.set('debug', (collectionName, method, query, doc) => {
			debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
		});
	}
}


module.exports = app;
