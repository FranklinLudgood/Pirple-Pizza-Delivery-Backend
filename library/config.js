/***************************************************************
* Title: config.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 10-17-2018
***************************************************************/

var environments = {};

// Development environments
environments.development = {
  'httpPort'        : 3000,
  'httpsPort'       : 3001,
  'environmentName' : 'development'
};

// Production environments
environments.production = {
  'httpPort'        : 5000,
  'httpsPort'       : 5001,
  'environmentName' : 'production'
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var environmentSetup = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

module.exports = environmentSetup
