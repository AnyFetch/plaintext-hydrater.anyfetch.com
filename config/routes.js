// # config/routes

// Routes client requests to handlers
module.exports = function router (server, handlers) {
  'use strict';  
  server.get('/hydrate', handlers.hydrate.execute);
};