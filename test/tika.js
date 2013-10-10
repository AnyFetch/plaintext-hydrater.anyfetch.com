'use strict';

require('should');
var fs = require('fs');

var tika = require('../lib/hydrater-tika');


describe('Test tika results', function() {
  it('returns the correct informations', function(done) {
    tika(__filename, function(err, results) {
      if(err) {
        throw err;
      }

      results.should.have.property('content-encoding', 'ISO-8859-1');

      // Tika adds a trailing "\n"
      results.should.have.property('raw', fs.readFileSync(__filename).toString() + "\n");

      done();
    });
  });
});
