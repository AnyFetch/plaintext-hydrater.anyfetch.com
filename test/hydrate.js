'use strict';

var request = require('supertest');
var should = require('should');
var async = require('async');

var app = require('../app.js');
var config = require('../config/configuration.js');

describe('POST /hydrate API endpoint', function() {
  it('should refuse request without metadatas', function(done) {
    request(app).post('/hydrate')
      .send({
        'file_path': 'http://example.org/file',
        'callback': 'http://example.org'
      })
      .expect(405)
      .end(done);
  });

  it('should refuse request without file_path', function(done) {
    request(app).post('/hydrate')
      .send({
        'metadatas': 'http://example.org/file',
        'callback': 'http://example.org'
      })
      .expect(405)
      .end(done);
  });

  it('should refuse request without callback', function(done) {
    request(app).post('/hydrate')
      .send({
        'metadatas': {},
        'file_path': 'http://example.org/file'
      })
      .expect(405)
      .end(done);
  });

  it('should immediately return 204', function(done) {
    this.timeout(500);
    request(app)
      .post('/hydrate')
      .send({
        'metadatas': {},
        'file_path': 'http://example.org/file',
        'callback': 'http://example.org'
      })
      .expect(204)
      .end(done);
  });
});
