const path = require('path');
const webpack = require('webpack');

/**
 * Production webpack settings.
 */
module.exports = {
  entry: [
    'babel-polyfill', 'es6-promise/auto', 'whatwg-fetch', `${__dirname}/src/index`
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `${path.basename(__dirname)}-bundle.js`
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
        query: {
          babelrc: false,
          presets: ['env', 'react', 'stage-2'],
          plugins: ['transform-decorators-legacy', 'transform-object-assign']
        }
      },
      {
        test: /\.s?css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&camelCase&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
};
