'use strict';

/**
 * @file Define the tika hydrater endpoint
 *
 * Extract generic information from files
 *
 */

var restify = require('restify');
var request = require('request');
var fs = require('fs');
var crypto = require('crypto');

var tika_helper = require('../helpers/tika_helper.js');


/**
 * This handler receives a document on a POST request and process the document
 * to find the content, the language and the associated meta-datas
 *
 * @param {Object} req Request object from the client
 * @param {Object} res Response we want to return
 * @param {Function} next Callback to call once res has been populated.
 */
module.exports = function(req, res, next) {
  if(!req.params.metadatas) {
		return next(new restify.BadMethodError('No metadatas to process'));
  }
  else if(!req.params.file_path) {
    return next(new restify.BadMethodError('No file to process'));
  } else if(!req.params.callback) {
    return next(new restify.BadMethodError('No specified callback'));
  }

  // Return immediately
  
  res.send(204);
  next();

  console.log("HANDLER RES1", req.params.file_path)

  // Download the file
  async.waterfall([
    function(cb) {
      console.log("HANDLER RES2", req.params.file_path)
      request.get(req.params.file_path, cb);
    },
    function(res, cb) {
      console.log("HANDLER RES3", res)
      var path = '/tmp/' + crypto.randomBytes(20).toString('hex');
      fs.writeFile(path, function(err) {
        cb(err, path);
      });
    },
    async.apply(tika_helper, path)
  ], function(err, data) {
    // Upload to server
    
  });
};
