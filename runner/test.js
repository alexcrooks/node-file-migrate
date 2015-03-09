'use strict';

/**
 * Test Runner.
 */
var TestRunner = function TestRunner(options) {
  this.options = options;
};

/**
 * With a null path, hit the callback with an error.
 * 
 * With path as an empty string, hit the callback with null data.
 * 
 * With any other path, hit the callback with some sample data.
 */
TestRunner.prototype.getFile = function (path, callback) {
  if (path === null) {
    return callback(new Error('cannot have null path'), null);
  } else if (path === '') {
    return callback(null, null);
  }
  return callback(null, 'somefiledata');
};

/**
 * With null file data, hit the callback with an error.
 * 
 * With any other file data, hit the callback without an error.
 */
TestRunner.prototype.putFile = function (path, fileData, callback) {
  if (fileData === null) {
    return callback(new Error('cannot have null data'));
  }
  return callback();
};

module.exports = exports = TestRunner;
