'use strict';

var async = require('async');

/**
 * File Migrate.
 *
 * A simple library which moves files from one place to another.
 *
 * @param Object options
 * @param Object methods An object containing the methods described above.
 * @constructor
 */
var FileMigrate = function FileMigrate(options, methods) {
  this.source = this.getRunner(options.source);
  this.destination = this.getRunner(options.destination);
  this.getFiles = methods.getFiles;
  this.fileCallback = methods.fileCallback;
  this.getInPath = methods.getInPath;
  this.getOutPath = methods.getOutPath;
};

/**
 * Initialize a runner.
 *
 * @param Object options
 * @return Object An instance of one of the runners.
 */
FileMigrate.prototype.getRunner = function (options) {
  var runner = require('../runner/' + options.type);
  return new runner(options);
};

/**
 * Migrate all of the files returned by the getFiles method provided in options.
 *
 * @param Function callback
 */
FileMigrate.prototype.migrate = function (callback) {
  var self = this;
  self.getFiles(function (err, files) {
    if (err) {
      return callback(err);
    }
    self.migrateFiles(files, self.migrateFile.bind(self), callback);
  });
};

/**
 * Asynchonously migrate an array of files.
 *
 * @param Object[] files
 * @param Function callback
 */
FileMigrate.prototype.migrateFiles = function (files, iterator, callback) {
  async.each(files, iterator, callback);
};

/**
 * Migrate an individual file from the source to the destination.
 *
 * @param Object file
 * @param Function callback Callback for async.each
 */
FileMigrate.prototype.migrateFile = function (file, callback) {
  var self = this;
  self.getFile(file, function (err, inPath, data) {
    if (err) {
      return self.migrateFileCallback(err, file, inPath, null, callback);
    }
    self.putFile(file, data, function (err, outPath) {
      self.migrateFileCallback(err, file, inPath, outPath, callback);
    });
  });
};

/**
 * A simple wrapper to call when the migration of a file errors or completes.
 *
 * We use this wrapper because we have two callbacks to report to when a file
 * has been migrated: async.each needs to know when an operation is complete and
 * the caller of this library provides a fileCallback which also should be
 * notified.
 *
 * @param Object|null err
 * @param Object|null file
 * @param String|null inPath
 * @param String|null outPath
 * @param Function callback Callback for async.each
 */
FileMigrate.prototype.migrateFileCallback = function (err, file, inPath, outPath, callback) {
  this.fileCallback(err, file, inPath, outPath);
  callback(err);
};

/**
 * Get a file from the source.
 *
 * @param Object file
 * @param Function callback
 */
FileMigrate.prototype.getFile = function (file, callback) {
  var path = this.getInPath(file);
  this.source.getFile(path, function (err, fileData) {
    err ? callback(err, path) : callback(null, path, fileData);
  });
};

/**
 * Write a file to the destination.
 *
 * @param Object file
 * @param * fileData
 * @param Function callback
 */
FileMigrate.prototype.putFile = function (file, fileData, callback) {
  var path = this.getOutPath(file);
  this.destination.putFile(path, fileData, function (err) {
    err ? callback(err, path) : callback(null, path);
  });
};

module.exports = exports = FileMigrate;
