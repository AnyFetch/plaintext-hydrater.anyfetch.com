'use strict';

// Load configuration and initialize server
var anyfetchHydrater = require('anyfetch-hydrater');

var config = require('./config/configuration.js');
var tika = require('./lib/');
var serverConfig = {
  concurrency: config.concurrency,
  hydrater_function: tika
};

var server = anyfetchHydrater.createServer(serverConfig);

// Expose the server
module.exports = server;
