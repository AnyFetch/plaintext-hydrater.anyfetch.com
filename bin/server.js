#!/bin/env node
// # bin/server
// Launch a node app

// Load configuration
var configuration = require("../config/configuration.js");
var server = require('../app.js');

// Start the server
server.listen(configuration.port, function() {
  'use strict';
  console.log("Tika hydrater started at " + server.url);
});
