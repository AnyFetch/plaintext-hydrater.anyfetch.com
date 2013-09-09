'use strict';

/**
 * @file Define the tika hydrater endpoint
 *
 * Extract generic information from files
 *
 */

var restify = require('restify');

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
	if(!req.files || !req.files.file) {
		return next(new restify.BadMethodError('No file to process'));
	}

	var path = req.files.file.path;

	tika_helper(path, function(err, data) {
    if(err) {
      return next(err);
    }

    res.send(data);
    next();
  });
};
