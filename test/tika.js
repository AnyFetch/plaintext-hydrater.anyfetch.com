'use strict';

require('should');

var tika = require('../lib/');


describe('Test tika results', function() {
  it('returns the correct informations for text file', function(done) {
    var document = {
      metadatas: {},
      datas: {}
    };

    tika(__dirname + '/samples/text.rtf', document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('metadatas');
      document.should.have.property('datas');
      document.datas.should.have.property('html', '<p>This is  some <b>bold</b> text.</p>\n');
      document.should.have.property('document_type', "document");

      // Tika adds a trailing "\n"
      document.metadatas.should.have.property('text', "This is some bold text.\n");

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
