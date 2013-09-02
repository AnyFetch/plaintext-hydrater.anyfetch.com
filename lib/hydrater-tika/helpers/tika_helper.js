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
 * @param {string} attr Specific comprtement for tika processing
 * @param {function} cb Callback, first parameter, is the error, then the processed data
 */
var extractData = function(path, attr, cb) {
	var content;

	var spawn = require('child_process').spawn;
  var tika = spawn('java', ['-jar', config.tika_path, attr, path]);

  tika.stdout.on('data', function (data) {
  	content = data.toString('utf8');
  });

  tika.stderr.on('data', function (data) {
		return cb(new Error('Invalid processing :' + data));
  });

  tika.on('close', function (code) {
  	if (code != 0) {
			return cb(new Error ('Invalid processing :' + data));
  	}

  	cb(null, content);
  });
} 

/**
 * Formatting the Metadatas the right way to send it back to the API
 *
 * @param {string} data The extracted metadata
 * @param {function} cb Callback, formated object 
 */

var formatMetaData = function(data, cb) {
	var meta = {};
	var rowData = data.split('\n');
	rowData.forEach(function(item) {
		var key = item.split(': ')[0]
		var value = item.split(': ')[1]
		if (value) {
			meta[key] = value;
		}
	});
	cb(meta);
}

/**
 * Extract all the accessible data with Tika
 *
 * @param {string} path Path to the file to process
 * @param {function} cb Callback
 */

module.exports = function (path, cb) {
	var html;
	var meta;
	var raw;

	async.parallel([
	    function(cb){
        extractData(path, '--html', function(err, data) {
        	html = data;
        	cb(err);
        });
	    },
	    function(cb){
        extractData(path, '--metadata',function(err, data) {
        	formatMetaData(data, function(formatedMeta) {
        		meta = formatedMeta;
        		cb(err);
        	});
        });
	    },
	    function(cb){
        extractData(path, '--text',function(err, data) {
        	raw = data;
        	cb(err);
        });
	    }
	],
	function(err){
		if (err) {
			return cb(new Error ('Processing error.'));
		};

		var returned_data = {
			"meta": meta,
			"html": html,
			"raw": raw,
		};

		cb(err, returned_data);
	});
}