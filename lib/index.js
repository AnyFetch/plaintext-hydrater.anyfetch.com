'use strict';

/**
 * @file Helper for Tika file processing
 * For more information about Tika :
 * See http://tika.apache.org/1.4/gettingstarted.html
 */

var config = require('../config/configuration.js');
var shellExec = require('child_process').exec;


/**
 * Extract the content of the specified file
 *
 * @param {string} path Path of the specified file
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
var extractData = function(path, cb) {
  shellExec('java -jar ' + config.tika_path + ' ' + path, {maxBuffer: 20480 * 1024}, function(err, stdout, stderr) {
    if(err) {
      return cb(err);
    }
    if(stderr) {
      console.warn("Tika warning: ", stderr);

      if(!stdout) {
        return cb(new Error(stderr));
      }
    }

    cb(null, stdout);
  });
};


/**
 * Extract all the accessible data with Tika
 *
 * @param {string} path Path to the file to process
 * @param {function} done Callback
 */
module.exports = function (path, document, cb) {
  extractData(path, function(err, data) {

    if(err) {
      return cb(err);
    }
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

    // Read metas
    var htmlMetas = data.match(/name="[^"]+" content="[^"]+"\/>/g);
    var regexp = /name="([^"]+)" content="([^"]+)"/;
    htmlMetas.map(function(htmlMeta) {
      var metas = htmlMeta.match(regexp);
      document.metadatas[metas[1].toLowerCase()] = metas[2];
    });

    // Cleanup resourcename
    delete document.metadatas.resourcename;
    delete document.metadatas['content-length'];
    delete document.metadatas['xmp-creatortool'];
    delete document.metadatas['xmp:creatortool'];
    delete document.metadatas.producer;

    cb(null, document);
  });
};
