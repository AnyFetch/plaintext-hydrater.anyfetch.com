/**
 * @file Defines the hydrater settings.
 */

// node_env can either be "development" or "production"
var node_env = process.env.NODE_ENV || "development";
var default_port = 8000;
var default_version = 1.4;
var default_path = "/etc/tika-"+default_version+"/tika-app-"+default_version+".jar";
if(node_env === "production") {
  default_port = 80;
}

// Exports configuration
module.exports = {
  env: node_env,
  port: process.env.PORT || default_port,

  tika_version: process.env.TIKA_VERSION || default_version,
  tika_path: process.env.TIKA_PATH || default_path,
};