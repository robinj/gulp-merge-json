/*!
 * Copyright 2015 Robin Janssens
 * Copyright 2015 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/gulp-merge/blob/master/LICENSE
 */
'use strict';

var gutil = require('gulp-util');
var merge = require('controlled-merge');
var path = require('path');
var through = require('through');

var PLUGIN_NAME = 'gulp-merge-json';

module.exports = function (fileName) {
    var merged = {};
    var firstFile = null;
    var keyList = [];
    var conflictingKeys = [];

    function parseAndMerge(file) {
        var fileContents, currentFilePath, conflictResolutionFunction, key;

        currentFilePath = file.path;

        if (file.isNull()) {
            return this.queue(file);
        }

        if (file.isStream()) {
            return this.emit('error', new gutil.PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Streaming not supported!'));
        }

        if (!firstFile) {
            firstFile = file;
        }

        fileContents = JSON.parse(file.contents.toString('utf8'));

        conflictResolutionFunction = function (val1, val2, key) {
            var error;

            error = {
                'val1': val1,
                'val2': val2,
                'key': key,
                'filePath1': keyList[key],
                'filePath2': currentFilePath
            };

            conflictingKeys.push(error);

            // There is no way to tell which value should be used, so just use the first one
            return val1;
        };

        for (key in fileContents) {
            if (fileContents.hasOwnProperty(key) && !keyList[key]) {
                keyList[key] = currentFilePath;
            }
        }

        try {
            merged = merge(conflictResolutionFunction, [merged, fileContents]);
        } catch (err) {
            return this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
        }
    }

    function endStream() {

        if (!firstFile) {
            return this.emit('end');
        }

        var contents = JSON.stringify(merged, null, '\t');

        var output = new gutil.File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: path.join(firstFile.base, fileName),
            contents: new Buffer(contents),
        });


        if (conflictingKeys.length > 0) {
            console.log('conflicting keys have been found');
            conflictingKeys.forEach(function (value) {
                console.log('Key ' + value.key + ' found in ' + value.filePath1 + ' but also in ' + value.filePath2);
            });

            this.emit('error', new gutil.PluginError(PLUGIN_NAME, {
                name: 'GulpControlledMergeError',
                message: 'Failed with ' + conflictingKeys.length + ' conflicting resource key' + (conflictingKeys.length > 0 ? 's' : '')
            }));
        }

        this.emit('data', output);
        this.emit('end');
    }

    return through(parseAndMerge, endStream);
};