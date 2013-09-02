// # config/routes

// Routes client requests to handlers
module.exports = function router (server, handlers) {
  'use strict';  
  server.post('/hydrate', handlers.hydrater.hydrate);
};