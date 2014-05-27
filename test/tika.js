'use strict';

require('should');

var tika = require('../lib/');


describe('Test tika results', function() {
  it('returns the correct informations for text file', function(done) {
    var document = {
      metadatas: {},
      datas: {}
    };

    var changes = {
      metadatas: {},
      user_access: [],
      actions: {},
      datas: {}
    };

    tika(__dirname + '/samples/text.rtf', document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.should.have.property('metadatas');
      changes.should.have.property('datas');
      changes.datas.should.have.property('html', '<p>This is some <b>bold</b> text.</p>\n');
      changes.datas.should.have.property('content-type', 'application/rtf');
      changes.should.have.property('document_type', "document");

      // Tika adds a trailing "\n"
      changes.metadatas.should.have.property('text', "This is some bold text.\n");

      done();
    });
  });

  it('returns the correct informations for binary file', function(done) {
    var document = {
      metadatas: {},
      datas: {}
    };

    var changes = {
      metadatas: {},
      user_access: [],
      actions: {},
      datas: {}
    };

    tika(__dirname + '/samples/node.png', document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.should.have.property('metadatas', {});
      changes.should.have.property('datas');
      changes.should.not.have.property('document_type');
      changes.datas.should.have.property('content-type', 'image/png');

      done();
    });
  });

  it('should return an errored document', function(done) {
    var document = {
      metadatas: {},
      datas: {}
    };

    var changes = {
      metadatas: {},
      user_access: [],
      actions: {},
      datas: {}
    };

    tika(__dirname + '/samples/errored.tt', document, changes, function(err, changes) {
      if(err) {
        throw err;
      }
      changes.should.have.property("hydration_errored", true);
      changes.should.have.property("hydration_error");
      done();
    });
  });

});
