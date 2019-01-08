const nodeExternals = require("webpack-node-externals");

module.exports = function(options) {
  this.extendBuild((config, context) => {
    if (context.isServer) {
      config.externals = [
        nodeExternals({
          whitelist: [/^vuetify/]
        })
      ];
    }
  });
};
