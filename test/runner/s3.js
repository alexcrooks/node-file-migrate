'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var S3Runner = require('../../runner/s3.js');
var AWS = require('aws-sdk');

describe('S3Runner', function () {
  var options, runner, cb;

  beforeEach(function () {
    options = {
      accessKeyId: 'akid',
      secretAccessKey: 'sak',
      region: 'us-west-2',
      bucket: 'some-bucket',
    };
    runner = new S3Runner(options);
    cb = sinon.stub();
    sinon.stub(runner.s3, 'getObject');
    sinon.stub(runner.s3, 'putObject');
  });

  afterEach(function () {
    runner.s3.getObject.restore();
    runner.s3.putObject.restore();
  });

  describe('constructor', function () {

    it('should set the options and an AWS.S3 instance', function () {
      expect(runner.options).to.equal(options);
      expect(runner.s3).to.be.an(AWS.S3);
    });

  });
  
  describe('function getS3Instance()', function () {
    
    it('should return an instance of AWS.S3 using the options', function () {
      expect(runner.getS3Instance()).to.eql(new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId: 'akid',
        secretAccessKey: 'sak',
        region: 'us-west-2',
      }));
    });
    
  });
  
  describe('function getS3Options()', function () {
    
    it('should return an object of options for the AWS.S3 constructor', function () {
      expect(runner.getS3Options()).to.eql({
        apiVersion: '2006-03-01',
        accessKeyId: 'akid',
        secretAccessKey: 'sak',
        region: 'us-west-2',
      })
    });
    
  });

  describe('function getFile()', function () {
    var params;

    beforeEach(function () {
      params = {
        Bucket: 'some-bucket',
        Key: 'some-path',
      };
    });

    it('should get a file from S3 and hit the callback with the file body', function (done) {
      var data = {Body: 'asdf'};
      runner.s3.getObject.withArgs(params).callsArgWith(1, null, data);
      runner.getFile('some-path', function (err, data) {
        expect(err).to.be(null);
        expect(data).to.equal('asdf');
        done();
      });
    });

    it('should hit the callback with an error if the fetch fails', function (done) {
      var error = new Error('something');
      runner.s3.getObject.withArgs(params).callsArgWith(1, error);
      runner.getFile('some-path', function (err, data) {
        expect(err).to.equal(error);
        expect(data).to.be(undefined);
        done();
      });
    });

  });

  describe('function putFile()', function () {
    var params, result;

    beforeEach(function () {
      params = {
        Bucket: 'some-bucket',
        Key: 'some-path',
        Body: 'asdf',
      };
      result = {
        ETag: '"912ec803b2ce49e4a541068d495ab570"',
      };
    });

    it('should upload the file to S3 and hit the callback', function (done) {
      runner.s3.putObject.withArgs(params).callsArgWith(1, null, result);
      runner.putFile('some-path', 'asdf', function (err) {
        expect(err).to.be(undefined);
        done();
      });
    });

    it('should hit the callback with an error if the upload fails', function (done) {
      var error = new Error('something');
      runner.s3.putObject.withArgs(params).callsArgWith(1, error);
      runner.putFile('some-path', 'asdf', function (err) {
        expect(err).to.equal(error);
        done();
      });
    });

    it('should hit the callback with an error if the checksums do not match', function (done) {
      result.ETag += 's';
      runner.s3.putObject.withArgs(params).callsArgWith(1, null, result);
      runner.putFile('some-path', 'asdf', function (err) {
        expect(err).to.be.an(Error);
        expect(err.message.match(/Checksum/)).to.be.ok();
        done();
      });
    });

  });
  
  describe('function generateChecksum()', function () {
    
    it('should generate an md5 hash of the input surrounded by quotes', function () {
      expect(runner.generateChecksum('asdf')).to.equal('"912ec803b2ce49e4a541068d495ab570"');
    });
    
  });

});
