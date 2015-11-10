/*!
 * Copyright 2015 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/gulp-merge/blob/master/LICENSE
 */
'use strict';

var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var merge = require('../');

var PLUGIN_NAME = 'gulp-merge-json';

require('mocha');
require('should');

it('should combine JSON files', function (done) {
    var stream = gulp.src('test/valid/json/*.json').pipe(merge('combined.json'));

    stream.on('data', function (file) {
        var expected = ['{', '\t"name": "Josh",', '\t"pet": {', '\t\t"name": "Indy"', '\t},', '\t"place": "San Francisco",', '\t"settings": {', '\t\t"likesSleep": true', '\t}', '}'].join('\n');

        file.contents.toString().should.eql(expected);

        done();
    });
});

it('should do nothing with no files', function (done) {
    var stream = gulp.src('test/empty/*.json').pipe(merge('combined.json'));

    stream.on('end', function () {
        done();
    });

    stream.on('data', function () {
        should.fail(null, null, 'Should have produced no output!');
    });
});

it('should error when the inputs have clashing keys', function (done) {
    var stream = gulp.src('test/conflicted/*.json').pipe(merge('combined.json'));

    stream.on('error', function (err) {
        err.message.should.equal('Failed with 1 conflicting resource keys');

        done();
    });

    stream.on('data', function () {
        should.fail(null, null, 'Should have failed!');
    });
});