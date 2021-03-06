'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var convert = require('convert-source-map');
var myth = require('./');

it('should postprocess CSS using Myth', function (cb) {
	var stream = myth();

	stream.on('data', function (file) {
		assert.equal(file.contents.toString(), 'a {\n  color: #a6c776;\n}');
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.css',
		contents: new Buffer(':root{--green:#a6c776;}a{color:var(--green);}')
	}));
});

it('should support Source Map', function (cb) {
	var stream = myth({sourcemap: true});

	stream.on('data', function (file) {
		assert(/sourceMappingURL/.test(file.contents.toString()));
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.css',
		contents: new Buffer(':root{--green:#a6c776;}a{color:var(--green);}')
	}));
});

it('should support relative paths', function(cb) {
	var stream = myth({sourcemap: true});

	stream.on('data', function (file) {
		var content = file.contents.toString();
		var sourcemap = convert.fromSource(content).sourcemap;
		sourcemap.sources.forEach(function(source){
			var startsWithBasename = source.indexOf(__dirname) === 0;
			assert(!startsWithBasename, "expected [" + source +"] to be relative");
		});
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/testdata/test.css',
		contents: new Buffer('@import url("test-imported.css");')
	}));

});
