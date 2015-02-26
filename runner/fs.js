'use strict';

var fs = require('fs');

/**
 * FS Runner.
 *
 * A runner providing both a getFile and putFile method to provide an
 * abstraction to the local file system when migrating.
 *
 * @param Object options Options formatted as described in fs-options.sample.js
 * @constructor
 */
var FsRunner = function FsRunner(options) {
  this.options = options;
};

/**
 * Get the path to this file.
 *
 * This method combines the relative path provided to getFile/putFile and the
 * absolute path defined in the options to ultimately find the file's location.
 *
 * @param String path
 * @return String
 */
FsRunner.prototype.getPath = function (path) {
  return this.options.absolutePath + path;
};

/**
 * Get a file from the local filesystem.
 *
 * @param String path The path to the file relative to absolutePath in options
 * @param Function callback
 */
FsRunner.prototype.getFile = function (path, callback) {
  path = this.getPath(path);
  fs.readFile(path, callback);
};

/**
 * Write a file to the local filesystem.
 *
 * @param String path The path to the file relative to absolutePath in options
 * @param * fileData
 * @param Function callback
 */
FsRunner.prototype.putFile = function (path, fileData, callback) {
  path = this.getPath(path);
  fs.writeFile(path, fileData, callback);
};

module.exports = exports = FsRunner;
