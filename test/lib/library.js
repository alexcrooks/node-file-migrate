'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var FileMigrate = require('../../lib/library.js');
var TestRunner = require('../../runner/test.js');

describe('FileMigrate', function () {
  var fm, options, methods;

  beforeEach(function () {
    options = {
      source: {
        type: 'test',
        source: 'option',
      },
      destination: {
        type: 'test',
        destination: 'option',
      },
    };
    methods = {
      getFiles: sinon.stub(),
      fileCallback: sinon.stub(),
      getInPath: sinon.stub(),
      getOutPath: sinon.stub(),
    };
    fm = new FileMigrate(options, methods);
  });

  describe('constructor', function () {

    it('should initialize the library and set the methods', function () {
      expect(fm.source).to.eql(new TestRunner(options.source));
      expect(fm.source.options).to.equal(options.source);
      expect(fm.destination).to.eql(new TestRunner(options.destination));
      expect(fm.destination.options).to.equal(options.destination);
      expect(fm.getFiles).to.equal(methods.getFiles);
      expect(fm.fileCallback).to.equal(methods.fileCallback);
      expect(fm.getInPath).to.equal(methods.getInPath);
      expect(fm.getOutPath).to.equal(methods.getOutPath);
    });

  });

  describe('function getRunner()', function () {

    it('should return a runner instance of the specified type', function () {
      var config = {type: 'test'};
      var runner = fm.getRunner(config);
      expect(runner).to.eql(new TestRunner(config));
      expect(runner.options).to.equal(config);
    });

  });

  describe('function migrate()', function () {

    beforeEach(function () {
      sinon.stub(fm, 'migrateFiles');
    });

    afterEach(function () {
      fm.migrateFiles.restore();
    });

    it('should hit the callback with an error if getting the files fails', function (done) {
      var err = new Error('something');
      methods.getFiles.callsArgWith(0, err);
      fm.migrate(function (err) {
        expect(err).to.equal(err);
        done();
      });
    });

    it('should run the file migration process with the returned array of files', function (done) {
      var files = [{file: '1'}, {file: '2'}];
      fm.getFiles.callsArgWith(0, null, files);
      fm.migrateFiles.callsArgWith(2, null);
      fm.migrate(function (err) {
        var args = fm.migrateFiles.getCall(0).args;
        expect(args[0]).to.equal(files);
        expect(err).to.be(null);
        done();
      });
    });

  });

  describe('function migrateFiles()', function () {

    it('should loop through an array of files and call the iterator for each instance', function (done) {
      var files = [
        {file: '1'},
        {file: '2'},
      ];
      var iterator = sinon.stub().callsArg(1);
      fm.migrateFiles(files, iterator, function () {
        expect(iterator.withArgs(files[0]).calledOnce).to.be(true);
        expect(iterator.withArgs(files[1]).calledOnce).to.be(true);
        done();
      });
    });

  });

  describe('function migrateFile()', function () {

    beforeEach(function () {
      sinon.spy(fm, 'migrateFileCallback');
      sinon.spy(fm, 'putFile');
      methods.getInPath.returns('some-in-path');
      methods.getOutPath.returns('some-out-path');
    });

    afterEach(function () {
      fm.migrateFileCallback.restore();
      fm.putFile.restore();
    });

    it('should short circuit if getting the file fails', function (done) {
      var file = {path: null};
      methods.getInPath.returns(null);
      fm.migrateFile(file, function (err) {
        expect(fm.migrateFileCallback.withArgs(err, file, null, null).calledOnce).to.be(true);
        expect(fm.putFile.called).to.be(false);
        expect(err).to.be.an(Error);
        expect(err.message.match(/null path/)).to.be.ok();
        done();
      });
    });

    it('should hit the migrateFileCallback when the putFile operation completes', function () {
      var file = {path: 'some-valid-path'};
      fm.migrateFile(file, function (err) {
        expect(fm.migrateFileCallback.withArgs(err, file, 'some-in-path', 'some-out-path').calledOnce).to.be(true);
        expect(fm.putFile.withArgs(file, 'somefiledata').calledOnce).to.be(true);
        expect(err).to.be(null);
      });
    });

  });

  describe('function migrateFileCallback()', function () {

    it('should call the library caller\'s callback and the provided callback', function () {
      var callback = sinon.stub();
      fm.migrateFileCallback('err', 'file', 'inpath', 'outpath', callback);
      expect(methods.fileCallback.withArgs('err', 'file', 'inpath', 'outpath').calledOnce).to.be(true);
      expect(callback.withArgs('err').calledOnce).to.be(true);
    });

  });

  describe('function getFile()', function () {

    beforeEach(function () {
      sinon.spy(fm.source, 'getFile');
    });

    afterEach(function () {
      fm.source.getFile.restore();
    });

    it('should get the file from the source using the defined format of in path', function () {
      var file = {};
      var cb = sinon.stub();
      methods.getInPath.withArgs(file).returns('some-in-path');
      fm.getFile(file, cb);
      expect(fm.source.getFile.withArgs('some-in-path').calledOnce).to.be(true);
      expect(cb.withArgs(null, 'some-in-path', 'somefiledata').calledOnce).to.be(true);
    });

  });

  describe('function putFile()', function () {

    beforeEach(function () {
      sinon.spy(fm.destination, 'putFile');
    });

    afterEach(function () {
      fm.destination.putFile.restore();
    });

    it('should get the file from the source using the defined format of in path', function () {
      var file = {};
      var cb = sinon.stub();
      methods.getOutPath.withArgs(file).returns('some-out-path');
      fm.putFile(file, 'somefiledata', cb);
      expect(fm.destination.putFile.withArgs('some-out-path', 'somefiledata').calledOnce).to.be(true);
      expect(cb.calledOnce).to.be(true);
    });

  });

});
