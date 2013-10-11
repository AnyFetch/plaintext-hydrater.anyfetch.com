'use strict';

require('should');
var request = require('request');


var server = require('../app.js');


describe('Server', function() {
  it('should be up and running', function(done) {
    server.listen(1337, function() {
      var params = {
        url: 'http://localhost:1337/hydrate',
        json: true
      };

      request.get(params, function(err, res) {
        res.body.should.have.property('code', 'MethodNotAllowedError');
        done();
      });
    });
  });
});
