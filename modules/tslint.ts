module.exports = function(options) {
  this.extendBuild(config => {
    if (config.module) {
      config.module.rules.push({
        enforce: "pre",
        test: /\.(ts)$/,
        loader: "tslint-loader",
        exclude: /(node_modules)/
      });
    }
  });
};
