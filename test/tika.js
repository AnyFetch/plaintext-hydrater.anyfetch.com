'use strict';

require('should');

var tika = require('../lib/');
var anyfetchHydrater = require('anyfetch-hydrater');
var HydrationError = anyfetchHydrater.HydrationError;

describe('Test tika results', function() {
  it('returns the correct informations for text file', function(done) {
    var document = {
      metadata: {},
      data: {}
    };

    var changes = anyfetchHydrater.defaultChanges();

    tika(__dirname + '/samples/text.rtf', document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.should.have.property('metadata');
      changes.should.have.property('data');
      changes.data.should.have.property('html', '<p>This is some <b>bold</b> text.</p>\n');
      changes.data.should.have.property('content-type', 'application/rtf');
      changes.should.have.property('document_type', "document");

      // Tika adds a trailing "\n"
      changes.metadata.should.have.property('text', "This is some bold text.\n");

      done();
    });
  });

  it('returns the correct informations for binary file', function(done) {
    var document = {
      metadata: {},
      data: {}
    };

    var changes = anyfetchHydrater.defaultChanges();

    tika(__dirname + '/samples/node.png', document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.should.have.property('metadata', {});
      changes.should.have.property('data');
      changes.data.should.have.property('content-type', 'image/png');

      done();
    });
  });

  it('remove invalid characters �', function(done) {
    var document = {
      metadata: {},
      data: {}
    };

    var changes = anyfetchHydrater.defaultChanges();

    tika(__dirname + '/samples/garbage.txt', document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.metadata.should.have.property('text', '\n');
      done();
    });
  });

  it('should return an errored document', function(done) {
    var document = {
      metadata: {},
      data: {}
    };

    var changes = anyfetchHydrater.defaultChanges();

    tika(__dirname + '/samples/errored.doc', document, changes, function(err) {
      if(err instanceof HydrationError) {
        done();
      }
      else {
        done(new Error("invalid error"));
      }
    });
  });

});
