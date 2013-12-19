'use strict';

require('should');
var fs = require('fs');

var tika = require('../lib/');


describe('Test tika results', function() {
  it('returns the correct informations for text file', function(done) {
    var document = {
      metadatas: {},
      datas: {}
    };

    tika(__filename, document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('metadatas');
      document.should.have.property('datas').with.keys('html');
      document.should.have.property('document_type', "document");
      document.metadatas.should.have.property('content-encoding', 'ISO-8859-1');

      // Tika adds a trailing "\n"
      document.metadatas.should.have.property('text', fs.readFileSync(__filename).toString() + "\n");

      done();
    });
  });

  it('returns the correct informations for binary file', function(done) {
    var document = {
      metadatas: {},
      datas: {}
    };

    tika(__dirname + '/samples/node.png', document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('metadatas');
      document.should.have.property('datas').eql({});
      document.should.not.have.property('document_type');
      document.metadatas.should.have.property('content-type', 'image/png');

      done();
    });
  });
});
