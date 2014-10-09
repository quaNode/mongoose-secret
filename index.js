'use strict';

var crypto = require('crypto');

function createSecret(size) {
	var hex = crypto.randomBytes(size).toString('hex');
	return hex.substring(0, size);
}

module.exports = function updatedPlugin (schema, options) {
	//prepare arguments
	options = options || {};
	var path = options.path || 'secret';
	var size = options.size || 32;

	schema.path(path, { type: String, index: true });

	schema.pre('save', function (next) {
		if(this.get(path)) {
			next();
		}
		
		this.set(path, createSecret(size));
		next();
	});

	schema.methods.generateNewSecret = function(cb) {
		return this.set(path, createSecret(size)).save(cb);
	};
};