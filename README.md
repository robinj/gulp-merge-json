# gulp-controlled-merge-json
[![NPM Version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependency Status][depstat-image]][depstat-url] [![Dev Dependency Status][devdepstat-image]][devdepstat-url]

A gulp plugin for deep-merging multiple JSON files into one file. Export as JSON or a node module.

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
