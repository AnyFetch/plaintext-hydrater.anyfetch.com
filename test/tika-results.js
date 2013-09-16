'use strict';

require('should');
var request = require('supertest');
var fs = require('fs');
var restify = require('restify');

var app = require('../app.js');


describe('Test tika results', function() {
  it('returns the correct informations', function(done) {
    //WARNING.
    // Is this test timeouting? This is due to should conditions being done beyond the standard event loop, and not properly bubbled up to Mocha.
    // So, in case of timeout, just uncomment the console.log a few lines below.

    // Create a fake HTTP server
    var server = restify.createServer();
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.get('/file', function(req, res, next) {
      fs.createReadStream(__filename).pipe(res);
      next();
    });

    server.patch('/result', function(req, res, next) {
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
