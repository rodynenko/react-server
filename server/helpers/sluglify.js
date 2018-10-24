const sluglify = text => text.toString().toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '') // eslint-disable-line
		.replace(/\-\-+/g, '-') // eslint-disable-line
		.replace(/^-+/, '')
		.replace(/-+$/, '');

module.exports = sluglify;
