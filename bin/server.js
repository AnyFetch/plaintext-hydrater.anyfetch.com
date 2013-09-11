#!/bin/env node
// # bin/server
// Launch a node app

// Load configuration
var configuration = require("../config/configuration.js");
var server = require('../app.js');

// Start the server
var spawner = require('sspawn')(server, configuration.port);
spawner.start();
