'use strict';

// Load configuration and initialize server
var cluestrFileHydrater = require('cluestr-file-hydrater');

var configuration = require('./config/configuration.js');
var tika = require('./lib/hydrater-tika');

var serverConfig = {
  concurrency: configuration.concurrency,
  hydrater_url: configuration.hydrater_url,
  hydrater_function: tika
};

var server = cluestrFileHydrater.createServer(serverConfig);

// Expose the server
module.exports = server;
