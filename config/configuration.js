/**
 * @file Defines the hydrater settings.
 */

// nodeEnv can either be "development" or "production"
var nodeEnv = process.env.NODE_ENV || "development";
var defaultPort = 8000;

var defaultTikaVersion = "1.6";
var defaultTikaPath = "/etc/tika-" + defaultTikaVersion + "/tika-app-" + defaultTikaVersion + ".jar";

// Number of tika instance to run simultaneously per process
var defaultConcurrency = 2;

if(nodeEnv === "production") {
  defaultPort = 80;
}

// Exports configuration
module.exports = {
  env: nodeEnv,
  port: process.env.PORT || defaultPort,

  tika_version: process.env.TIKA_VERSION || defaultTikaVersion,
  tika_path: process.env.TIKA_PATH || defaultTikaPath,

  concurrency: process.env.CONCURRENCY || defaultConcurrency,
  tasksPerProcess: process.env.TASKS_PER_PROCESS,

  redisUrl: process.env.REDIS_URL,
  appName: process.env.APP_NAME || "plaintext-hydrater",

  opbeat: {
    organizationId: process.env.OPBEAT_ORGANIZATION_ID,
    appId: process.env.OPBEAT_APP_ID,
    secretToken: process.env.OPBEAT_SECRET_TOKEN
  }
};
