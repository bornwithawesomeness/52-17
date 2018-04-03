var webpack = require('webpack');
var _ = require('lodash');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var publicPath = '/assets/';

var baseConfig = require('./base');

var config = _.merge({
    output: {
        path: path.join(__dirname, '/../dist/assets'),
        filename: 'app[hash].js',
        publicPath: publicPath
    },
    entry: ['babel-polyfill',path.join(__dirname, '../src/start')],
    debug: false,
    cache: false,
    devtool: 'sourcemap',
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin(
          {
              filename: '../../dist/index.html',
              template: path.join(__dirname, '../src/template.html'),
              inject:'body'
          }
      ),
      new AssetsPlugin({
          path: path.join(__dirname, '/../dist/'),
          prettyPrint:true
      }),
      new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
      })
  ]
}, baseConfig);

config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  exclude: /(node_modules|bower_components)/
  /* ,
  include: [
      path.join(__dirname, '/../src'),
      path.join(__dirname, '/../node_modules/joi/')
  ]*/
});

module.exports = config;
