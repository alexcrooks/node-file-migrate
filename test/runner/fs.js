'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var FsRunner = require('../../runner/fs.js');
var fs = require('fs');

describe('FsRunner', function () {
  var runner, options, cb;

  beforeEach(function () {
    options = {
      absolutePath: '/something/',
    };
    runner = new FsRunner(options);
    cb = sinon.stub();
    sinon.stub(fs, 'readFile');
    sinon.stub(fs, 'writeFile');
  });

  afterEach(function () {
    fs.readFile.restore();
    fs.writeFile.restore();
  });

  describe('constructor', function () {

    it('should set the options on the instance', function () {
      expect(runner.options).to.equal(options);
    });

  });

  describe('function getPath()', function () {

    it('should return a combination of the path in the options and the provided path', function () {
      expect(runner.getPath('else/file.txt')).to.equal('/something/else/file.txt');
    });

  });

  describe('function getFile()', function () {

    it('should get the file from the local filesystem', function () {
      runner.getFile('else/file.txt', cb);
      expect(fs.readFile.withArgs('/something/else/file.txt', cb).calledOnce).to.be(true);
    });

  });

  describe('function putFile()', function () {

    it('should write the file to the local filesystem', function () {
      runner.putFile('else/file.txt', 'filedata', cb);
      expect(fs.writeFile.withArgs('/something/else/file.txt', 'filedata', cb).calledOnce).to.be(true);
    });

  });

});
