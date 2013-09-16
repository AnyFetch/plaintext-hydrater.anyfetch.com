'use strict';

/**
 * @file Helper for Tika file processing
 * For more information about Tika :
 * See http://tika.apache.org/1.4/gettingstarted.html
 */

var async = require('async');

var config = require('../../../config/configuration.js');


/**
 * Extract the content of the specified file
 *
 * @param {string} path Path of the specified file
 * @param {string} attr Specific behavior for tika processing (html, metadata, text, language)
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
var extractData = function(path, attr, cb) {
  var allowedAttrs = ['html', 'metadata', 'text', 'language'];
  if(allowedAttrs.indexOf(attr) === -1) {
    cb(new Error('Invalid attr value.'));
  }
  
  var content = '';
  attr = '--' + attr;
  var shellExec = require('child_process').exec;
  var tika = shellExec('java -jar ' + config.tika_path + ' ' + attr + ' ' + path, function(err, stdout, stderr) {
    if(err) {
      cb(err);
    }
    if(stderr) {
      cb(new Error(stderr));
    }

    cb(null, stdout);
  });
};


/**
 * Formatting the metadatas the right way to send it back to the API
 * Assumes valid data.
 *
 * @param {string} data The extracted metadata, e.g. "Created: adate\nModified: anotherdate"
 * @param {function} cb Callback, first parameter is the formatted object {'created': 'adate', 'modified': 'anotherdate'}
 */
var formatMetaData = function(data, cb) {
  var meta = {};
  var rowData = data.split('\n');
  rowData.forEach(function(item) {
    var splitted = item.split(': ');

    if(splitted[1]) {
      meta[splitted[0].toLowerCase()] = splitted[1];
    }
  });

  cb(meta);
};


/**
 * Extract all the accessible data with Tika
 *
 * @param {string} path Path to the file to process
 * @param {function} done Callback
 */
module.exports = function (path, done) {
  async.parallel({
    html: function(cb){
      extractData(path, 'html', function(err, data) {
        if(err) {
          return cb(err);
        }
        if(!data) {
          return cb(new Error("Tika did not return any datas."));
        }

        var re = /<body>([\s\S]+)<\/body>/; // \s\S tricks for dotall behavior
        console.log("OK1");
        cb(null, data.match(re)[1]);
      });
    },
    metas: function(cb){
      extractData(path, 'metadata', function(err, data) {
        if(err) {
          return cb(err);
        }

        formatMetaData(data, function(formattedMeta) {
          console.log("OK2");

          cb(null, formattedMeta);
        });
      });
    },
    raw: function(cb){
      extractData(path, 'text', function(err, data) {
        console.log("OK3");

        cb(err, data);
      });
    }
  }, function(err, datas){
    console.log("DEAL", datas);
    if (err) {
      return done(err);
    }

    datas.metas.html = datas.html;
    datas.metas.raw = datas.raw;

    done(null, datas.metas);
  });
};
