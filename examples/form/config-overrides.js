const {alias, configPaths} = require('react-app-rewire-alias')

module.exports = function override(config) {
    alias(configPaths())(config)
    return config;
}
/*
module.exports = function override(config) {
    console.log("entro");
  config.resolve = {
    ...config.resolve,
    alias: { 'Forms': path.resolve(__dirname, 'node_modules/relay-forms/') },
  };

  return config;
};*/