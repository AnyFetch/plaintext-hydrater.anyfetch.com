// # config/routes

// Routes client requests to handlers
module.exports = function router (server, lib) {
  'use strict';  
  server.post('/hydrate', lib.hydrate);
};