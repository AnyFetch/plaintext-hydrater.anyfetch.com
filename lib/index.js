'use strict';

/**
 * @file Helper for Tika file processing
 * For more information about Tika :
 * See http://tika.apache.org/1.4/gettingstarted.html
 */

var config = require('../config/configuration.js');
var shellExec = require('child_process').exec;
var async = require('async');

/**
 * Extract all the accessible data with Tika
 *
 * @param {string} path Path to the file to process
 * @param {function} done Callback
 */
module.exports = function(path, document, finalCb) {
  async.waterfall([
    /**
     * Extract the content of the specified file
     *
     * @param {string} path Path of the specified file
     * @param {function} cb Callback, first parameter, is the error if any, then the processed data
     */
    function launchTika(cb) {
      shellExec('java -jar ' + config.tika_path + ' ' + path, {maxBuffer: 20480 * 1024, timeout: 900000}, function(err, stdout, stderr) {
        var erroredDocument = {};
        if(err) {
          erroredDocument = {
            id : document.id,
            identifier: document.identifier,
            hydration_errored: true,
            hydration_error : err.toString()
          };
          return finalCb(null, erroredDocument);
        }
        if(stderr) {
          console.warn("Tika warning: ", stderr);

          if(!stdout) {
            erroredDocument = {
              id : document.id,
              identifier: document.identifier,
              hydration_errored: true,
              hydration_error : new Error(stderr, stdout).toString()
            };
            return finalCb(null, erroredDocument);
          }
        }

        cb(null, stdout);
      });
    },
    function hydrateDocument(data, cb){
      if(!data) {
        return cb(new Error("Tika did not return any datas."));
      }

      // Read text
      var re = /<body>([\s\S]+)<\/body>/; // \s\S tricks for dotall behavior
      var body = data.match(re);
      // No matches == no html.
      // For instance on pictures.
      if(body && body[1]) {
        // Save HMTL as data (not metadata)
        document.datas.html = body[1];
        // Save raw text (strip down all <..> stuff)
        document.metadatas.text = document.datas.html.replace(/<(?:.|\n)*?>/gm, '');
        document.metadatas.text = document.metadatas.text.replace(/(\n|\t| )(\t|\n| )+/g, '$1');
        document.document_type = "document";
      }

      // Read content type
      var contentType = data.match(/name="Content-Type" content="([^"]+)"\/>/i)[1] || '';
      if(contentType) {
        document.datas['content-type'] = contentType;
      }

      cb();
    }
  ], function(err) {
    finalCb(err, document);
  });
};
