'use strict';

/**
 * @file Helper for Tika file processing
 * For more information about Tika :
 * See http://tika.apache.org/1.4/gettingstarted.html
 */

var config = require('../config/configuration.js');
var shellExec = require('child_process').exec;
var async = require('async');
var HydrationError = require('anyfetch-hydrater').HydrationError;
var entities = new (require('html-entities').AllHtmlEntities)();

/**
 * Extract all the accessible data with Tika
 *
 * @param {string} path Path to the file to process
 * @param {function} done Callback
 */
module.exports = function(path, document, changes, finalCb) {
  async.waterfall([
    /**
     * Extract the content of the specified file
     *
     * @param {string} path Path of the specified file
     * @param {function} cb Callback, first parameter, is the error if any, then the processed data
     */
    function launchTika(cb) {
      shellExec('java -jar ' + config.tika_path + ' ' + path, {maxBuffer: 20480 * 1024}, function(err, stdout, stderr) {
        if(err) {
          return cb(new HydrationError([err, stderr]));
        }
        if(stderr && !stdout) {
          return cb(new HydrationError(stderr));
        }
        // If there is stderr && stdout, stderr can just be a warning and tika hydrates anyway
        cb(null, stderr, stdout);
      });
    },
    function hydrateDocument(warning, data, cb){
      if(!data) {
        return cb(new HydrationError("Tika did not return any data."));
      }

      data = data.replace(/�/g, "");

      // Read text
      var re = /<body>([\s\S]+)<\/body>/; // \s\S tricks for dotall behavior
      var body = data.match(re);
      // No matches == no html.
      // For instance on pictures.
      if(warning && !body) {
        // The warning was big enough to break hydration
        return cb(new HydrationError(warning));
      }
      if(body && body[1]) {
        // Save HMTL as data (not metadata)
        changes.data.html = body[1];
        // Save raw text (strip down all <..> stuff)
        changes.metadata.text = changes.data.html.replace(/<(?:.|\n)*?>/gm, '');
        changes.metadata.text = changes.metadata.text.replace(/(\n|\t| )(\t|\n| )+/g, '$1');
        changes.metadata.text = entities.decode(changes.metadata.text);
        changes.document_type = "document";
      }

      // Read content type
      var contentType = data.match(/name="Content-Type" content="([^"]+)"\/>/i)[1] || '';
      if(contentType) {
        changes.data['content-type'] = contentType;
      }

      cb();
    }
  ], function(err) {
    finalCb(err, changes);
  });
};
