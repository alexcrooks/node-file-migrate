# Node File Migrate

A library for migrating files from A to B.

Example use case: you have an app which stores files on the local filesystem.
You wrote some code so now files are uploaded to S3 and you need to move all of 
your legacy files to the S3 bucket.

Accepted sources/destinations include: local filesystem, Amazon S3.

This library expects configuration for the source and destination, and a
function whose callback will provide a list of files to migrate relative to the
source.

This library also accepts hooks for successful and failed migrations so that
apps using the library may handle success and failure as they desire.

## How to Use

1. `cd /path/to/your/app/`
2. `npm install --save git+ssh://git@github.com:stage3systems/node-file-migrate.git`
3. Within your code:

```js
var FileMigrate = require('node-file-migrate');
var options = require('./options'); // see *-options.sample.js in this repo for example
var methods = {
  getFiles: getFiles,
  fileCallback: fileCallback,
  getInPath: getInPath,
  getOutPath: getOutPath,
};
var fm = new FileMigrate(options, methods);
fm.migrate(function (err) {
  // ...
});
```

## Prerequisites

1. npm
2. node

## Configuration

1. `git clone https://github.com/stage3systems/node-file-migrate.git`
2. `cd node-file-migrate`
3. `make install`

## Running Tests

1. `make unit` or `make test`

## Supported Sources/Destinations

* Local filesystem
* Amazon S3 - does not currently support multi-part uploads

## API

The following methods are the public methods for this library's API.

* [`FileMigrate` (constructor)](#constructor)
* [`migrate`](#migrate)

<a name="constructor" />
### FileMigrate(options, methods)

Builds an instance of this library.

__Arguments__

* `options` - an object following the form of the *-optinos.sample.js files in
  this repo.
  
* `methods` - an object containing four methods: `getFiles`, `fileCallback`,
  `getInPath`, `getOutPath`.
  
	* `getFiles(callback)` - a method to get an array.
	  
	  `callback` should be a function with two arguments: err which is set on fail,
	  and files which should be an array of objects which are file records (these
	  should not contain the file data, they should just be the database records or
	  simple objects containing the paths to the files).
	
	* `fileCallback(err, file, inPath, outPath)` - a method which is called when the
	  migrate of an individual file is complete
	  
	  `err` will be null if the file was successfully migrated, or set if not
	  
	  `file` will be one of the objects in the array returned by getFiles
	  
	  `inPath` will be the returned value from getInPath.
	  
	  `outPath` will be the returned value from getOutPath. May be null if the
	  migration failed before trying to save the file.
	
	* `getInPath(file)` - a method to get the source path of the file
	  
	  `file` will be one of the objects in the array returned by getFiles
	
	* `getOutPath(file)` - a method to get the destination path of the file
	  
	  `file` will be one of the objects in the array returned by getFiles

__Examples__

```js
var options = require('./options'); // see *-options.sample.js
var methods = {
  getFiles: function (callback) {
    callback(null, [
      {path: 'foo/bar/baz.jpg'},
      {path: 'something/else.txt'},
      {path: 'hello.js'},
    ]);
  },
  
  fileCallback: function (err, file, inPath, outPath) {
    if (err) {
      return log(err);
    }
    console.log(inPath + ' migrated to ' + outPath);
  },
  
  getInPath: function (file) {
    return file.path;
  },
  
  getOutPath: function (file) {
    var extension = getFileExtension(file.path);
    return randomUuid() + extension;
  },
};
var fm = new FileMigrate(options, methods);
```

### migrate(callback)

__Arguments__

* `callback` - a method with an err argument which will be null on a fully
  successful migration and set on a partial or complete failure.

__Examples__

```js
fm.migrate(function (err) {
  if (err) {
    console.log('migration was not successful');
    return console.log(err);
  }
  console.log('migration was successful');
});
```

## Contributing

Feel free to submit a pull request to improve this library in any way.

### Implementing a New Runner

To implement a runner, you must add two files to this library:

* runner/*.js (the library)
* runner/*-options.sample.js (an example of the options to provide to the library
instance)

Please see runner/example.js and runner/example-options.sample.js for examples
of the methods that must be exposed in the API / general formatting of a runner.
