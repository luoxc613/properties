const path = require('path');

'use strict';

/**
 * Development-only webpack settings.
 */
const webpack = require('webpack');
const config = require('./webpack.config');
const Visualizer = require('webpack-visualizer-plugin');

config.devtool = 'cheap-module-eval-source-map';
config.entry.unshift('webpack-hot-middleware/client');
config.output.filename = `${path.basename(__dirname)}-bundle.js`;

config.plugins = [
  new Visualizer(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  })
];

module.exports = config;
