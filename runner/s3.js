'use strict';

var AWS = require('aws-sdk');
var md5 = require('MD5');
var apiVersion = '2006-03-01';

/**
 * S3 Runner.
 *
 * A runner providing both a getFile and putFile method to provide an
 * abstraction to S3 when migrating.
 *
 * @param Object options Options formatted as described in s3-options.sample.js
 * @constructor
 */
var S3Runner = function S3Runner(options) {
  this.options = options;
  this.s3 = this.getS3Instance();
};

/**
 * Build an instance of the AWS.S3 library with our options.
 *
 * @return AWS.S3
 */
S3Runner.prototype.getS3Instance = function () {
  return new AWS.S3(this.getS3Options());
};

/**
 * Build the options for the initialization of the AWS.S3 library.
 *
 * @return Object
 */
S3Runner.prototype.getS3Options = function () {
  return {
    apiVersion: apiVersion,
    accessKeyId: this.options.accessKeyId,
    secretAccessKey: this.options.secretAccessKey,
    region: this.options.region,
  }
};

/**
 * Get a file from the bucket.
 *
 * @param String path The path to the file within the bucket
 * @param Function callback
 */
S3Runner.prototype.getFile = function (path, callback) {
  var params = {
    Bucket: this.options.bucket,
    Key: path,
  };
  this.s3.getObject(params, function (err, data) {
    err ? callback(err) : callback(null, data.Body);
  });
};

/**
 * Write a file to the bucket.
 *
 * Also validates a checksum against the returned ETag to verify success.
 *
 * @param String path The path to the file within the bucket
 * @param * fileData
 * @param Function callback
 */
S3Runner.prototype.putFile = function (path, fileData, callback) {
  var self = this;
  var params = {
    Bucket: this.options.bucket,
    Key: path,
    Body: fileData,
  };
  self.s3.putObject(params, function (err, data) {
    if (err) {
      return callback(err);
    } else if (self.generateChecksum(fileData) !== data.ETag) {
      return callback(new Error('Checksums do not match'));
    }
    callback();
  });
};

/**
 * Generate an AWS-compatible checksum from the file data.
 *
 * AWS returns their ETag surrounded by double quotes so this does as well.
 *
 * NOTE: This does not currently support multi-part uploads.
 *
 * @param * fileData
 * @return String
 */
S3Runner.prototype.generateChecksum = function (fileData) {
  return '"' + md5(fileData) + '"';
};

module.exports = exports = S3Runner;
