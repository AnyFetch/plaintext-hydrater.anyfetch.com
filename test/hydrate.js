'use strict';

var request = require('supertest');
var should = require('should');
var async = require('async');

var app = require('../app.js');
var config = require('../config/configuration.js');

describe('POST /hydrate API endpoint', function() {
	it('should refuse every request without a file', function(done) {
		var req = request(app).post('/hydrate')
			.expect(405)
			.end(done);
	});

	it('should accept request with a file attached', function(done) {
		var req = request(app).post('/hydrate')

		req.attach('file', __filename)
        .expect(200)
        .end(done);
 	});

	it('should respond with the rights informations', function(done) {
		var req = request(app).post('/hydrate')

		req.attach('file', __filename)
        .expect('Content-Type', /json/)
        .expect(/text\/plain/)
        .expect(/supertest/)
        .expect(/html/)
        .end(done);
 	});
});