'use strict';

var request = require('supertest');
var should = require('should');
var async = require('async');
var http = require('http');
var fs = require('fs');

var app = require('../app.js');
var config = require('../config/configuration.js');

describe('Test tika results', function() {


  it('returns the correct informations', function(done) {
    // Create a fake HTTP server
    http.createServer(function (req, res) {
      if(req.url == "/file") {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        return res.end(fs.readFileSync(__filename))
      } else {
        console.log("PARAMS", req.param);
        req.params.metadatas.should.have.property('raw');
        req.params.metadatas.should.have.property('html');
        req.params.metadatas.should.have.property('content-encoding');
        
        done();
      }
    }).listen(1337, '127.0.0.1');

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
