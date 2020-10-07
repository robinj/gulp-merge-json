# gulp-controlled-merge-json

**Warning: this repo is not maintained anymore. It will continue to exist as I am aware of projects which depend on it. If you need to make changes, please fork this repo**

[![NPM Version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependency Status][depstat-image]][depstat-url] [![Dev Dependency Status][devdepstat-image]][devdepstat-url]

A gulp plugin for deep-merging multiple JSON files into one file. Any conflicting attributes are recorded and output to the console once the merge has completed. 

The main use case, and the reason that this plugin was developed, is the merging of language files.

## Usage
```javascript
var merge = require('gulp-controlled-merge-json');

/*
	Basic functionality
 */
gulp.src('jsonFiles/**/*.json')
	.pipe(merge('combined.json'))
	.pipe(gulp.dest('./dist'));
```

This will merge your input files into a file called "combined.json" and then output them into your dist directory.

## Example Input
This is an example of an input where there are no conflicting keys

```JSON
/*
	json/defaults.json
 */
{
	"key1": {
		"data1": "value1",
		"data2": "value2"
	},
	"key2": {
		"dataA": "valueA",
		"dataB": {
			"a": "b",
			"c": "d"
		}
	}
}

/*
	json/development.json
 */
{
	"key1": {
		"data1": "devValue"
	},
	"key2": {
		"dataB": {
			"c": "DEV MODE!"
		}
	},
	"key3": {
		"important": "value"
	}
}
```

## Example Output
```JSON
/*
	dist/combined.json
 */
{
	"key1": {
		"data1": "devValue",
		"data2": "value2"
	},
	"key2": {
		"dataA": "valueA",
		"dataB": {
			"dataA": "valueA",
			"dataB": {
				"a": "b",
				"c": "DEV MODE!"
			}
		}
	},
	"key3": {
		"important": "value"
	}
}
```

## Conflicts
In the event of a conflict, the first value will be merged and the attribute name will be output to the console. 
```
conflicting keys have been found
Key myKey found in /path/to/jsonFile.json but also in  /path/to/other/jsonFile.json
```

The plugin will then emit an error.

# Credits
Based on gulp-merge-json by [@joshswan](https://github.com/joshswan). Adapted by [@robinj][robin-janssens-gh] ([Robin Janssens][robin-janssens]).

[build-url]: https://travis-ci.org/robinj/gulp-controlled-merge-json
[build-image]: https://travis-ci.org/robinj/gulp-controlled-merge-json.svg?branch=master
[coverage-url]: https://coveralls.io/github/robinj/gulp-controlled-merge-json?branch=master
[coverage-image]: https://coveralls.io/repos/robinj/gulp-controlled-merge-json/badge.svg?branch=master&service=github
[depstat-url]: https://david-dm.org/robinj/gulp-controlled-merge-json
[depstat-image]: https://david-dm.org/robinj/gulp-controlled-merge-json.svg
[devdepstat-url]: https://david-dm.org/robinj/gulp-controlled-merge-json#info=devDependencies
[devdepstat-image]: https://david-dm.org/robinj/gulp-controlled-merge-json/dev-status.svg
[npm-url]: https://www.npmjs.com/package/gulp-controlled-merge-json
[npm-image]: https://badge.fury.io/js/gulp-controlled-merge-json.svg
[robin-janssens]: https://robinjanssens.com
[robin-janssens-gh]: https://github.com/robinj
