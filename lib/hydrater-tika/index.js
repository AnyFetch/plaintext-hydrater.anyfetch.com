'use strict';

var restify = require('restify');
var crypto = require('crypto');
var fs = require('fs');

var config = require('../../config/configuration.js');

module.exports.hydrate = function (req, res, next) {

	// Check if the file has been sent
	if(!req.files || !req.files.file) {
		return next(new restify.InvalidArgumentError('Invalid file to process.'));
	}

	var content;
	var path = req.files.file.path;

	var spawn = require('child_process').spawn;
  var tika = spawn('java', ['-jar', config.tika_path, '--text', path]);
  
  tika.stderr.setEncoding('utf8');

  tika.stdout.on('data', function (data) {
  	content = data;
  	console.log(content);
  });

  tika.stderr.on('data', function (data) {
		return next(new restify.InvalidArgumentError('Invalid processing :' + data));
  });

  tika.on('close', function (code) {
  	if (code != 0) {
			return next(new restify.InvalidArgumentError('Invalid processing :' + data));
  	}

  	res.set('content-type', 'text/plain; charset=utf-8');
  	res.send('' + content);
  	return next();
  });

};