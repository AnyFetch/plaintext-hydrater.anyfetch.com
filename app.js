'use strict';

// Load configuration and initialize server
var restify = require('restify');
var configuration = require('./config/configuration.js');
var lib = require("./lib/hydrater-tika");
var handlers = lib.handlers;
var server = restify.createServer();


// Middleware Goes Here
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Load routes
require("./config/routes.js")(server, handlers);

// Expose the server
module.exports = server;
