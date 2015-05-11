'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var objectAssign = require('object-assign');
var myth = require('myth');
var path = require('path');

module.exports = function (options) {
	options = options || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-myth', 'Streaming not supported'));
			return;
		}
		options = objectAssign({}, options, {source: path.basename(file.path)});

		try {
			var cwd = process.cwd();
			process.chdir(path.dirname(file.path));
			file.contents = new Buffer(myth(file.contents.toString(), options));
			process.chdir(cwd);
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-myth', err, {fileName: file.path}));
		}

		cb();
	});
};
