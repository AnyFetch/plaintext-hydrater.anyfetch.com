'use strict';

var async = require('async');
var config = require('../../../config/configuration.js');

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



module.exports = function (path, cb) {
	var html;
	var meta;
	var language;

	async.parallel([
	    function(callback){
        extractData(path, '--html', function(err, data) {
        	html = data;
        	callback();
        });
	    },
	    function(callback){
        extractData(path, '--metadata',function(err, data) {
        	formatMetaData(data, function(formatedMeta) {
        		meta = formatedMeta;
        		callback();
        	});
        });
	    },
	    function(callback){
        extractData(path, '--language',function(err, data) {
        	language = data;
        	callback();
        });
	    }
	],
	function(err, results){
		var returned_data = {
			"meta": meta,
			"language": language,
			"html": html
		};

		return cb(err, returned_data);
	});
}