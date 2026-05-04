// Source: https://gist.github.com/sibelius/24f63eef7f43b15dc73c4a0be11bbef8

// eslint-disable-next-line
module.exports = function (context, options) {
  return {
    name: 'webpack-overrides-docusaurus-plugin',
    // eslint-disable-next-line
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          fallback: {
            path: require.resolve('path-browserify'),
            crypto: false,
          },
        },
      };
    },
  };
};
