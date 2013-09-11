'use strict';

var request = require('supertest');
var should = require('should');
var async = require('async');
var fs = require('fs');
var restify = require('restify');

var app = require('../app.js');
var config = require('../config/configuration.js');

describe('Test tika results', function() {
  it('returns the correct informations', function(done) {
    //WARNING.
    // Is this test timeouting? This is due to should conditions being done beyond the standard event loop, and not properly bubbled up to Mocha.
    // So, in case of timeout, just uncomment the console.log below.

    // Create a fake HTTP server
    var server = restify.createServer();
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.get('/file', function(req, res, next) {
      res.send(200);
      res.send(fs.readFileSync(__filename));
      next();
    });

    server.post('/result', function(req, res, next) {
      // Uncomment on test timeout
      //console.log(req.params);
      req.params.metadatas.should.have.property('raw');
      req.params.metadatas.should.have.property('html');
      req.params.metadatas.should.have.property('content-encoding', 'ISO-8859-1');
      res.send(204);

      next();

      // Teardown
      server.close();
      done();
    });

    server.listen(1337, function() {});

    request(app).post('/hydrate')
      .send({
        metadatas: {},
        file_path: 'http://127.0.0.1:1337/file',
        callback: 'http://127.0.0.1:1337/result'
      })
      .expect(204)
      .end(function() {});
  });
});
