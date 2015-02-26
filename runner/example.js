'use strict';

/**
 * Example Runner.
 *
 * An example of the bare-minimum requirements to introduce a new runner.
 *
 * Your runner can add more functionality and must just implement this at a
 * minimum. For example, your putFile might validate a checksum.
 *
 * @param Object options Options formatted as described in example-options.sample.js
 * @constructor
 */
var ExampleRunner = function ExampleRunner(options) {
  this.options = options;
};

/**
 * Get a file from somewhere.
 *
 * @param String path The relative path to the file
 * @param Function callback
 */
ExampleRunner.prototype.getFile = function (path, callback) {
  getFileFromPath(path, function (err, fileData) {
    /**
     * If there is an error, hit the callback with the error. If getting the
     * file was successful then hit the callback with the first argument set to
     * null and the second argument set to the file data.
     */
    err ? callback(err) : callback(null, fileData);
  });
};

/**
 * Write a file somewhere.
 *
 * @param String path The relative path to the file
 * @param * fileData
 * @param Function callback
 */
ExampleRunner.prototype.putFile = function (path, fileData, callback) {
  writeFileToPath(path, fileData, function (err, data) {
    /**
     * If there was an error, hit the callback with the error. If writing the
     * file was successful then the callback just needs to be called and no
     * arguments are necessary.
     */
    err ? callback(err) : callback();
  });
};

module.exports = exports = ExampleRunner;
