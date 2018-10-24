function filterKeys(obj, keys) {
	const res = {};

	Object.keys(obj).forEach((key) => {
		if (keys.indexOf(key) > -1) {
			res[key] = obj[key];
		}
	});

	return res;
}

module.exports = filterKeys;
