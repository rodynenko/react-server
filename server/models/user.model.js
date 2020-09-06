const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	name: String,
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	salt: { type: String }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
	encryptPassword(password) {
		return crypto.createHmac('sha1', this.salt)
			.update(password)
			.digest('hex');
	},
	authenticate(plainText) {
		return this.encryptPassword(plainText) === this.password;
	},
});

UserSchema.static('makeSalt', () => `${Math.round((new Date().valueOf() * Math.random()))}`);

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
