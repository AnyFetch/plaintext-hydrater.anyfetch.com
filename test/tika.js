'use strict';

require('should');

var fs = require('fs');
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
      changes.data.should.have.property('html', '<p>This is some <b>bold</b> text &lt;3.</p>\n<p/>\n');
      changes.data.should.have.property('content_type', 'application/rtf');
      changes.should.have.property('document_type', "document");

      // Tika adds a trailing "\n"
      changes.metadata.should.have.property('text', "This is some bold text &lt;3.\n");

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
      changes.data.should.have.property('content_type', 'image/png');

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

      changes.metadata.should.have.property('text', 'lol a word is playing hide and seek\n');
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

  it('should not return an errored document with file too big', function(done) {
    var document = {
      metadata: {},
      data: {}
    };

    var maxObjectSize = 8500000;
    var pathBigFile = '/tmp/test-plaintext-big-file';
    // Create a big file
    var content = fs.readFileSync(__filename);

    while(content.length <= maxObjectSize) {
      content += content;
    }
    fs.writeFileSync('/tmp/test-plaintext-big-file', content);

    var changes = anyfetchHydrater.defaultChanges();

    // A file too big is not an error, it is what we want. If a file is this big, we send an empty doc instead
    tika(pathBigFile, document, changes, function(err) {
      changes.data.should.eql({});
      changes.metadata.should.eql({});
      done(err);
    });
  });

});
