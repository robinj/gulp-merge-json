/*!
 * Copyright 2015 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/gulp-merge/blob/master/LICENSE
 */
'use strict';

var gutil = require('gulp-util');
var merge = require('controlled-merge-with-attribute');
var path = require('path');
var through = require('through');

var PLUGIN_NAME = 'gulp-merge-json';

module.exports = function (fileName, edit, startObj, endObj, exportModule) {
    var file;

    if ((startObj && typeof startObj !== 'object') || (endObj && typeof endObj !== 'object')) {
        throw new gutil.PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Invalid start and/or end object!');
    }

    var editFunc;

    if (typeof edit === 'function') {
        editFunc = edit;
    } else if (typeof edit === 'object') {
        editFunc = function (json) {
            return merge(json, edit);
        };
    } else {
        editFunc = function (json) {
            return json;
        };
    }

    var merged = startObj || {};
    var firstFile = null;
    var conflictingKeys = [];


    function parseAndMerge(file) {

        var conflictResolutionFunction = function (val1, val2, key) {
            var error;

            error = {
                'val1': val1,
                'val2': val2,
                'key': key,
                'filePath': file.path
            };

            conflictingKeys.push(error);

            // There is no way to tell which value should be used, so just use the first one
            return val2;
        };

        if (file.isNull()) {
            return this.queue(file);
        }

        if (file.isStream()) {
            return this.emit('error', new gutil.PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Streaming not supported!'));
        }

        if (!firstFile) {
            firstFile = file;
        }


        try {
            merged = merge(conflictResolutionFunction, [merged, editFunc(JSON.parse(file.contents.toString('utf8')))]);
        } catch (err) {
            return this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
        }
    }

    function endStream() {

        var conflictResolutionFunction = function (val1, val2, key) {
            var error;

            error = new gutil.PluginError('gulp-controlled-merge-json', {
                'val1': val1,
                'val2': val2,
                'key': key,
            });

            conflictingKeys.push(error);

            // There is no way to tell which value should be used, so just use the first one
            return val2;
        };

        if (!firstFile) {
            return this.emit('end');
        }

        if (endObj) {
            console.log(endObj);
            merged = merge(conflictResolutionFunction, [merged, endObj]);
        }

        var contents = JSON.stringify(merged, null, '\t');

        if (exportModule) {
            contents = 'module.exports = ' + contents + ';';
        }

        var output = new gutil.File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: path.join(firstFile.base, fileName),
            contents: new Buffer(contents),
        });


        if(conflictingKeys.length > 0) {
            console.log('conflicting keys have been found');
            conflictingKeys.forEach(function(value) {
                console.log('Key ' + value.key + ' in ' + value.filePath);
            });

            this.emit('error', new gutil.PluginError(PLUGIN_NAME, {
                name: 'GulpControlledMergeError',
                message: 'Failed with ' + conflictingKeys.length + ' conflicting resource keys'
            }));
        }

        this.emit('data', output);
        this.emit('end');
    }

    return through(parseAndMerge, endStream);
};
