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
var async = require('async');

var tikaShell = require('../helpers/tika-shell.js');


/**
 * This handler receives a document on a POST request and process the document
 * to find the content, the language and the associated meta-datas
 *
 * @param {Object} req Request object from the client
 * @param {Object} res Response we want to return
 * @param {Function} next Callback to call once res has been populated.
 */
module.exports = function(req, res, next) {
  if(!req.params.file_path) {
    return next(new restify.BadMethodError('No file to process'));
  } else if(!req.params.callback) {
    return next(new restify.BadMethodError('No specified callback'));
  }

  res.send(204);
  next();

  // Push to queue
  require('../../../app.js').queue.push({
    file_path: req.params.file_path,
    callback: req.params.callback
  });

};
